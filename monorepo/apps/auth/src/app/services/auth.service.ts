import * as bcrypt from 'bcrypt';
import { ELoginType, IJwtPayload } from 'libs/shared/src/lib/core';
import { BaseResDto } from 'libs/shared/src/lib/dto/base.dto';
import { Repository } from 'typeorm';

import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { JwtService } from '@nestjs/jwt';
import { ClientKafka, RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import {
  config,
  ERole,
  LoginReqDto,
  LoginResWithTokensDto,
  LogoutResDto,
  RefreshTokenResDto,
  ValidateUserReqDto,
  ValidateUserResDto,
} from '@nyp19vp-be/shared';

import { AccountEntity } from '../entities/account.entity';
import { RefreshTokenBlacklistEntity } from '../entities/refresh-token-blacklist.entity';
import { RoleEntity } from '../entities/role.entity';
import { AccountService } from './account.service';
import * as crypto from 'crypto';

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

    @Inject('USERS_SERVICE') private readonly usersClient: ClientKafka,

    // service
    @Inject(forwardRef(() => AccountService))
    private readonly accountService: AccountService,
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

    const socialAccounts = await accountFound.socialAccounts;

    return {
      statusCode: HttpStatus.OK,
      message: `user ${username} validated`,
      user: {
        id: accountFound.id,
        username: accountFound.username,
        email: accountFound.email,
        role: accountFound.role.roleName,
        userInfoId: accountFound.userInfoId,
        password: undefined,
        hashedPassword: undefined,
        socialAccounts: socialAccounts.map((sa) => sa.platform),
      },
    };
  }

  async validateToken(token: string): Promise<LoginResWithTokensDto> {
    const decodeRes = this.jwtService.decode(token);
    const payload: IJwtPayload = decodeRes as IJwtPayload;

    return {
      statusCode: HttpStatus.OK,
      message: 'Login successfully',
      data: {
        auth: {
          ...payload,
        },
        userInfo: (
          await this.accountService.getUserInfoById(payload.user.userInfoId)
        ).user,
      },
    };
  }

  decodeToken(token: string): IJwtPayload {
    console.log('------------------------');

    console.log('decodeToken', token);

    const decodeResult = this.jwtService.decode(token);

    const jwtPayload: IJwtPayload = {
      ...(decodeResult as IJwtPayload),
    };
    console.log('decodeResult', decodeResult);

    if (
      !jwtPayload.user ||
      !jwtPayload.user.username ||
      !jwtPayload.user.role ||
      ![ERole.admin, ERole.user].includes(jwtPayload.user.role) ||
      !jwtPayload.iat ||
      !jwtPayload.exp
    ) {
      // find what condition is not matched
      console.log('------------------------');

      console.log(!decodeResult?.['user']?.username);
      console.log(!decodeResult?.['user']?.hashedPassword);
      console.log(!decodeResult?.['user']?.role);
      console.log(
        ![ERole.admin, ERole.user].includes(decodeResult?.['user']?.role),
      );
      console.log(!decodeResult?.['iat']);
      console.log(!decodeResult?.['exp']);

      const rpcExc: BaseResDto = {
        message: 'Jwt payload error xyz',
        statusCode: HttpStatus.UNAUTHORIZED,
      };

      throw new RpcException(rpcExc);
    }

    return jwtPayload;
  }

  async login(userDto: LoginReqDto): Promise<LoginResWithTokensDto> {
    const validateUserRes: ValidateUserResDto = await this.validateUser({
      username: userDto.username,
      password: userDto.password,
      loginType: ELoginType.email,
    });

    const accessToken = this.generateAccessJWT({
      user: validateUserRes.user,
    });
    const refreshToken = this.generateRefreshJWT({
      user: validateUserRes.user,
    });

    return Promise.resolve({
      statusCode: HttpStatus.OK,
      message: 'Login successfully',
      accessToken: accessToken,
      refreshToken: refreshToken,
      data: {
        auth: validateUserRes.user,
        userInfo: (
          await this.accountService.getUserInfoById(
            validateUserRes.user.userInfoId,
          )
        ).user,
      },
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

      // hash refreshToken with sha256
      const hash = crypto.createHash('sha256');
      hash.update(refreshToken);

      const refreshTokenRecord = this.refreshTokenBlacklistRepo.create({
        account: account,
        userId: account.id,
        token: hash.digest('hex'),
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
  async validateRefreshToken(refreshToken: string): Promise<boolean> {
    // hash refreshToken with sha256
    const hash = crypto.createHash('sha256');
    hash.update(refreshToken);
    const hashedToken = hash.digest('hex');

    console.log('hashedToken', hashedToken);

    return !this.refreshTokenBlacklistRepo.exist({
      where: {
        token: hashedToken,
      },
    });
  }

  refreshAccessToken(payload: IJwtPayload): string {
    const accessToken = this.generateAccessJWT(payload);

    return accessToken;
  }

  generateAccessJWT(payload: IJwtPayload): string {
    delete payload.exp;
    delete payload.iat;
    return this.jwtService.sign(payload, {
      expiresIn: config.auth.strategies.strategyConfig.accessJwtTtl, // 10 mins
      secret: config.auth.strategies.strategyConfig.accessJwtSecret,
    });
  }

  generateRefreshJWT(payload: IJwtPayload): string {
    delete payload.exp;
    delete payload.iat;
    return this.jwtService.sign(payload, {
      expiresIn: config.auth.strategies.strategyConfig.refreshJwtTtl, // 10 days
      secret: config.auth.strategies.strategyConfig.refreshJwtSecret,
    });
  }

  async refresh(refreshToken: string): Promise<RefreshTokenResDto> {
    if (await this.validateRefreshToken(refreshToken)) {
      const jwtPayload: IJwtPayload = this.decodeToken(refreshToken);

      const accessToken = this.generateAccessJWT(jwtPayload);

      return {
        statusCode: HttpStatus.OK,
        message: 'Refresh token successfully',
        accessToken: accessToken,
      };
    } else {
      return {
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Refresh token fail cause user has been logout',
      };
    }
  }
}