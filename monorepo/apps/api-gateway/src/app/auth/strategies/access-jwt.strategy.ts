import { ExtractJwt, Strategy } from 'passport-jwt';

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { ACCESS_JWT_STRATEGY_NAME } from '../constants/authentication';
import { config } from '@nyp19vp-be/shared';

import { Request } from 'express';
import { AuthService } from '../auth.service';
import { IJwtPayload, IUser } from 'libs/shared/src/lib/core';

@Injectable()
export class AccessJwtStrategy extends PassportStrategy(
  Strategy,
  ACCESS_JWT_STRATEGY_NAME,
) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.auth.strategies.strategyConfig.accessJwtSecret,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: IJwtPayload) {
    return payload;
  }
}
