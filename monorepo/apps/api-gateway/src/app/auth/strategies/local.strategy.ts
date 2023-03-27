import * as dotenv from 'dotenv';
import { ENV_FILE } from 'libs/shared/src/lib/core/constants';
import { Strategy } from 'passport-local';

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { LOCAL_STRATEGY_NAME } from '../constants/authentication';
import { core } from '@nyp19vp-be/shared';
import { AuthService } from '../auth.service';

dotenv.config({
  path: process.env.ENV_FILE ? process.env.ENV_FILE : ENV_FILE.DEV,
});

@Injectable()
export class LocalStrategy extends PassportStrategy(
  Strategy,
  LOCAL_STRATEGY_NAME,
) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<core.IUser> {
    console.log({
      username,
      password,
    });

    const user = await this.authService.validateUser(
      username,
      password,
      core.ELoginType.username,
    );

    console.log('LocalStrategy.validate user ', user);

    return user;
  }
}
