import { ExtractJwt, Strategy } from 'passport-jwt';

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { ACCESS_JWT_STRATEGY_NAME } from '../constants/authentication';
import { IJwtPayload } from '../interfaces';
import { strategyConfig } from './strategy.config';

@Injectable()
export class AccessJwtStrategy extends PassportStrategy(
  Strategy,
  ACCESS_JWT_STRATEGY_NAME,
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: strategyConfig.accessJwtSecret,
    });
  }

  async validate(payload: IJwtPayload) {
    return payload;
  }
}
