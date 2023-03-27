import {
  config,
  utils,
  ValidateUserReqDto,
  ValidateUserResDto,
} from '@nyp19vp-be/shared';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { JwtService } from '@nestjs/jwt';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';

import {
  LoginReqDto,
  LoginResDto,
  LoginResWithTokensDto,
} from '@nyp19vp-be/shared';

import {
  ACCESS_JWT_COOKIE_NAME,
  ACCESS_JWT_DEFAULT_TTL,
  REFRESH_JWT_COOKIE_NAME,
  REFRESH_JWT_DEFAULT_TTL,
} from '../constants/authentication';
import { AccountEntity } from '../entities/account.entity';
import { RefreshTokenBlacklistEntity } from '../entities/refresh-token-blacklist.entity';
import { core } from '@nyp19vp-be/shared';

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
    private accountRespo: Repository<AccountEntity>,
    private jwtService: JwtService,
    @InjectRepository(RefreshTokenBlacklistEntity)
    private refreshTokenBlacklistRepository: Repository<RefreshTokenBlacklistEntity>,
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
    loginType,
  }: ValidateUserReqDto): Promise<ValidateUserResDto> {
    console.log('validateUser', username, password, loginType);

    const accountFound: AccountEntity = null;

    if (loginType === core.ELoginType.email) {
      //
    }
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
      message: `user ${username}/${loginType} validated`,
      user: {
        username: accountFound.username,
        password: accountFound.hashedPassword,
      },
    };
  }

  decodeToken(token: string): core.IJwtPayload {
    return {
      username: this.jwtService.decode(token)['username'] ?? '',
      iat: this.jwtService.decode(token)['iat'] ?? undefined,
      exp: this.jwtService.decode(token)['exp'] ?? undefined,
    };
  }

  async login(userDto: LoginReqDto): Promise<LoginResWithTokensDto> {
    const accessToken = await this.generateAccessJWT({
      username: userDto.username,
    });
    const refreshToken = await this.generateRefreshJWT({
      username: userDto.username,
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
  async logout(refreshToken: string): Promise<boolean> {
    try {
      const decoded = this.decodeToken(refreshToken);
      console.log(decoded);

      const account = await this.accountRespo.findOneBy({
        username: decoded.username,
      });

      if (!account) {
        return false;
      }

      const refreshTokenRecord = this.refreshTokenBlacklistRepository.create({
        account: account,
        userId: account.id,
        token: refreshToken,
        expiredAt: new Date(decoded.exp * 1e3),
      });

      await this.refreshTokenBlacklistRepository.save(refreshTokenRecord);

      console.log('add token', refreshTokenRecord.token, ' to blacklist');

      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * return true if token is valid, false if token is in blacklist
   */
  async validateRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<boolean> {
    const token = await this.refreshTokenBlacklistRepository.findOneBy({
      token: refreshToken,
    });

    console.log('token', token);
    const isTokenInBlacklist = token !== null;

    // if token in blacklist, it is not valid
    return !isTokenInBlacklist;
  }

  refreshAccessToken(username: string): string {
    const accessToken = this.generateAccessJWT({
      username: username,
    });

    return accessToken;
  }

  generateAccessJWT(payload: core.IJwtPayload): string {
    return this.jwtService.sign(payload, {
      expiresIn: config.auth.strategies.strategyConfig.accessJwtTtl, // 10 mins
      secret: config.auth.strategies.strategyConfig.accessJwtSecret,
    });
  }

  generateRefreshJWT(payload: core.IJwtPayload): string {
    return this.jwtService.sign(payload, {
      expiresIn: config.auth.strategies.strategyConfig.refreshJwtTtl, // 10 days
      secret: config.auth.strategies.strategyConfig.refreshJwtSecret,
    });
    config.auth.strategies.strategyConfig;
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

  setCookie(res: Response, accessToken: string, refreshToken: string) {
    console.log({
      accessToken,
      refreshToken,
    });

    res.cookie(ACCESS_JWT_COOKIE_NAME, accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: utils.toMs(ACCESS_JWT_DEFAULT_TTL),
    });
    res.cookie(REFRESH_JWT_COOKIE_NAME, refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: utils.toMs(REFRESH_JWT_DEFAULT_TTL),
    });
  }
}
