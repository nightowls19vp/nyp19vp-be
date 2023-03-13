import * as dotenv from 'dotenv';
import { Strategy } from 'passport-local';

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AccountEntity } from '../entities/account.entity';
import { LOCAL_STRATEGY_NAME } from '../constants/authentication';
import { AuthService } from '../services/auth.service';

dotenv.config({
  path: process.env.ENV_FILE ? process.env.ENV_FILE : '.env.dev',
});

@Injectable()
export class LocalStrategy extends PassportStrategy(
  Strategy,
  LOCAL_STRATEGY_NAME,
) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<AccountEntity> {
    console.log({
      username,
      password,
    });

    const user = await this.authService.validateUser(username, password);

    console.log('LocalStrategy.validate user ', user);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
