import * as dotenv from 'dotenv';
import { Request } from 'express';
import { ENV_FILE } from 'libs/shared/src/lib/core/constants';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { forwardRef, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import {
  REFRESH_JWT_COOKIE_NAME,
  REFRESH_JWT_STRATEGY_NAME,
} from '../constants/authentication';
import { AuthService } from '../services/auth.service';
import { strategyConfig } from './strategy.config';

dotenv.config({
  path: process.env.ENV_FILE ? process.env.ENV_FILE : ENV_FILE.DEV,
});

export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  REFRESH_JWT_STRATEGY_NAME,
) {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.[REFRESH_JWT_COOKIE_NAME];
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: strategyConfig.refreshJwtSecret,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    const refreshToken = req.cookies[REFRESH_JWT_COOKIE_NAME];

    console.log(refreshToken);

    const decoded = this.authService.decodeToken(refreshToken);

    const isTokenValid = await this.authService.validateRefreshToken(
      decoded.username,
      refreshToken,
    );
    if (!isTokenValid) {
      console.log('token is in blacklist');

      throw new HttpException(
        {
          statusCode: 401,
          message: 'The refresh token is in blacklist',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    return payload;
  }
}
