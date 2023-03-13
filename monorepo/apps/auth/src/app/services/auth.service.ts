import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import ms from 'ms';
import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginReqDto } from '@nyp19vp-be/shared';

import {
  ACCESS_JWT_COOKIE_NAME,
  ACCESS_JWT_DEFAULT_TTL,
  REFRESH_JWT_COOKIE_NAME,
  REFRESH_JWT_DEFAULT_TTL,
} from '../constants/authentication';
import { AccountEntity } from '../entities/account.entity';
import { RefreshTokenBlacklistEntity } from '../entities/refresh-token-blacklist.entity';
import { IJwtPayload } from '../interfaces';
import { strategyConfig } from '../strategies/strategy.config';

@Injectable()
export class AuthService {
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

  async validateUser(
    username: string,
    password: string,
  ): Promise<AccountEntity | null> {
    console.log('validateUser', username, password);

    const accountFound = await this.accountRespo.findOneBy({
      username: username,
    });

    const isPwdMatched = await bcrypt.compare(
      password,
      accountFound.hashedPassword,
    );

    if (isPwdMatched) {
      return accountFound;
    }
    return null;
  }

  decodeToken(token: string): IJwtPayload {
    return {
      username: this.jwtService.decode(token)['username'] ?? '',
      iat: this.jwtService.decode(token)['iat'] ?? undefined,
      exp: this.jwtService.decode(token)['exp'] ?? undefined,
    };
  }

  async login(userDto: LoginReqDto): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const accessToken = await this.generateAccessJWT({
      username: userDto.username,
    });
    const refreshToken = await this.generateRefreshJWT({
      username: userDto.username,
    });

    return { accessToken, refreshToken };
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

  generateAccessJWT(payload: IJwtPayload): string {
    return this.jwtService.sign(payload, {
      expiresIn: strategyConfig.accessJwtTtl, // 10 mins
      secret: strategyConfig.accessJwtSecret,
    });
  }

  generateRefreshJWT(payload: IJwtPayload): string {
    return this.jwtService.sign(payload, {
      expiresIn: strategyConfig.refreshJwtTtl, // 10 days
      secret: strategyConfig.refreshJwtSecret,
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

  setCookie(res: Response, accessToken: string, refreshToken: string) {
    console.log({
      accessToken,
      refreshToken,
    });

    res.cookie(ACCESS_JWT_COOKIE_NAME, accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: ms(ACCESS_JWT_DEFAULT_TTL),
    });
    res.cookie(REFRESH_JWT_COOKIE_NAME, refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: ms(REFRESH_JWT_DEFAULT_TTL),
    });
  }
}
