import { ExtractJwt, Strategy } from 'passport-jwt';

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { ACCESS_JWT_STRATEGY_NAME } from '../constants/authentication';
import { config, core } from '@nyp19vp-be/shared';

@Injectable()
export class AccessJwtStrategy extends PassportStrategy(
  Strategy,
  ACCESS_JWT_STRATEGY_NAME,
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.auth.strategies.strategyConfig.accessJwtSecret,
    });
  }

  async validate(payload: core.IJwtPayload) {
    return payload;
  }
}
