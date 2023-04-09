import {
  config,
  ERole,
  LogoutReqDto,
  LogoutResDto,
  utils,
  ValidateUserReqDto,
  ValidateUserResDto,
} from '@nyp19vp-be/shared';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { JwtService } from '@nestjs/jwt';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';

import { LoginReqDto, LoginResWithTokensDto } from '@nyp19vp-be/shared';

import { AccountEntity } from '../entities/account.entity';
import { RefreshTokenBlacklistEntity } from '../entities/refresh-token-blacklist.entity';
import { ELoginType, IJwtPayload } from 'libs/shared/src/lib/core';
import { BaseResDto } from 'libs/shared/src/lib/dto/base.dto';
import { RoleEntity } from '../entities/role.entity';
import { AccountService } from './account.service';

@Injectable()
export class AuthService {
  googleLogin(req) {
    if (!req.user) {
      return 'No user from google';
    }

    return {
      message: 'User information from google',
      user: req.user,
    };
  }
  constructor(
    @InjectRepository(AccountEntity)
    private accountRepo: Repository<AccountEntity>,
    @InjectRepository(AccountEntity)
    private roleRepo: Repository<RoleEntity>,
    private jwtService: JwtService,
    @InjectRepository(RefreshTokenBlacklistEntity)
    private refreshTokenBlacklistRepo: Repository<RefreshTokenBlacklistEntity>,
  ) {}
  getData(): { message: string } {
    return { message: 'Welcome to auth/Auth!' };
  }

  /**
   * Validate `username` and `password`, return `AccountEntity` object if validated
   * else throw and `RpcException`
   * @param username
   * @param password
   * @returns `IUser`
   */
  async validateUser({
    username,
    password,
  }: ValidateUserReqDto): Promise<ValidateUserResDto> {
    console.log('validateUser', username, password);

    const accountFound: AccountEntity = await this.accountRepo.findOne({
      where: [
        {
          username: username,
        },
        {
          email: username,
        },
      ],
    });

    if (accountFound === null) {
      const userNotFoundRpcException: LoginResWithTokensDto = {
        statusCode: HttpStatus.NOT_FOUND,
        message: `user with user name ${username} not found`,
      };
      throw new RpcException(userNotFoundRpcException);
    }

    const isPwdMatched = await bcrypt.compare(
      password,
      accountFound.hashedPassword,
    );

    console.debug(`isPwdMatched = `, isPwdMatched);

    if (!isPwdMatched) {
      const userNotFoundRpcException: LoginResWithTokensDto = {
        statusCode: HttpStatus.UNAUTHORIZED,
        message: `password is not matched`,
      };
      throw new RpcException(userNotFoundRpcException);
    }

    return {
      statusCode: HttpStatus.OK,
      message: `user ${username} validated`,
      user: {
        username: accountFound.username,
        hashedPassword: accountFound.hashedPassword,
        role: accountFound.role.roleName,
      },
    };
  }

  decodeToken(token: string): IJwtPayload {
    const decodeResult = this.jwtService.decode(token);

    if (
      decodeResult?.['user']?.username ||
      decodeResult?.['user']?.hashedPassword ||
      decodeResult?.['user']?.role ||
      ![ERole.admin, ERole.user].includes(decodeResult?.['user']?.role) ||
      decodeResult?.['iat'] ||
      decodeResult?.['exp']
    ) {
      const rpcExc: BaseResDto = {
        message: 'Jwt paload error',
        statusCode: HttpStatus.UNAUTHORIZED,
      };

      throw new RpcException(rpcExc);
    }

    return {
      user: {
        username: decodeResult?.['user']?.username ?? null,
        role: decodeResult?.['user']?.role ?? null,
      },
      iat: decodeResult?.['iat'] ?? null,
      exp: decodeResult?.['exp'] ?? null,
    };
  }

  async login(userDto: LoginReqDto): Promise<LoginResWithTokensDto> {
    const validateUserRes: ValidateUserResDto = await this.validateUser({
      username: userDto.username,
      password: userDto.password,
      loginType: ELoginType.email,
    });

    const accessToken = await this.generateAccessJWT({
      user: validateUserRes.user,
    });
    const refreshToken = await this.generateRefreshJWT({
      user: validateUserRes.user,
    });

    return Promise.resolve({
      statusCode: HttpStatus.OK,
      message: 'Login successfully',
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  }

  /**
   * Add refreshToken to blacklist, remove cookie
   * @param refreshToken String
   * @returns boolean
   */
  async logout(refreshToken: string): Promise<LogoutResDto> {
    try {
      const decoded = this.decodeToken(refreshToken);
      console.log(decoded);

      const account = await this.accountRepo.findOneBy({
        username: decoded.user.username,
      });

      if (!account) {
        const accountNotFountRpcException: LogoutResDto = {
          statusCode: 401,
          message: `account not found`,
        };

        throw new RpcException(accountNotFountRpcException);
      }

      const refreshTokenRecord = this.refreshTokenBlacklistRepo.create({
        account: account,
        userId: account.id,
        token: refreshToken,
        expiredAt: new Date(decoded.exp * 1e3),
      });

      await this.refreshTokenBlacklistRepo.save(refreshTokenRecord);

      console.log('add token', refreshTokenRecord.token, ' to blacklist');

      return {
        statusCode: HttpStatus.OK,
        message: 'Logout successfully',
      };
    } catch (error) {
      throw new RpcException(error);
    }
  }

  /**
   * return true if token is valid, false if token is in blacklist
   */
  async validateRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<boolean> {
    const token = await this.refreshTokenBlacklistRepo.findOneBy({
      token: refreshToken,
    });

    console.log('token', token);
    const isTokenInBlacklist = token !== null;

    // if token in blacklist, it is not valid
    return !isTokenInBlacklist;
  }

  refreshAccessToken(payload: IJwtPayload): string {
    const accessToken = this.generateAccessJWT(payload);

    return accessToken;
  }

  generateAccessJWT(payload: IJwtPayload): string {
    return this.jwtService.sign(payload, {
      expiresIn: config.auth.strategies.strategyConfig.accessJwtTtl, // 10 mins
      secret: config.auth.strategies.strategyConfig.accessJwtSecret,
    });
  }

  generateRefreshJWT(payload: IJwtPayload): string {
    return this.jwtService.sign(payload, {
      expiresIn: config.auth.strategies.strategyConfig.refreshJwtTtl, // 10 days
      secret: config.auth.strategies.strategyConfig.refreshJwtSecret,
    });
  }

  // async authorize(userId: string, actionId: string): Promise<boolean> {
  //   // get user role
  //   const account = await this.accountRespo.findOneBy({ id: userId });

  //   // const requiredRoles: Roles[] = this.actionService.findOneBy({
  //   //   actionId: actionId,
  //   // });

  //   // Get required role for action #actionId
  //   const requiredRoles = ['admin', 'user'];

  //   let isAuthorized = false;

  //   // for (const role in requiredRoles) {
  //   //   if (user.role.id === role.id) {
  //   //     isAuthorized = true;

  //   //     break;
  //   //   }
  //   // }

  //   for (const role of requiredRoles) {
  //     if (role === account.role) {
  //       isAuthorized = true;
  //     }
  //   }

  //   return isAuthorized;
  // }
}
