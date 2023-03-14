import { Response } from 'express';
import { firstValueFrom } from 'rxjs';

import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import {
  kafkaTopic,
  LoginReqDto,
  LoginResWithTokensDto,
  LogoutReqDto,
  LogoutResDto,
  RegisterReqDto,
  RegisterResDto,
} from '@nyp19vp-be/shared';

import {
  ACCESS_JWT_COOKIE_NAME,
  ACCESS_JWT_DEFAULT_TTL,
  REFRESH_JWT_COOKIE_NAME,
  REFRESH_JWT_DEFAULT_TTL,
} from './constants/authentication';
import { toMs } from './utils/ms';

@Injectable()
export class AuthService {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientKafka,
  ) {}

  async login(reqDto: LoginReqDto): Promise<LoginResWithTokensDto> {
    try {
      return await firstValueFrom(
        this.authClient.send(
          kafkaTopic.AUTH.LOGIN,
          JSON.stringify({ body: reqDto }),
        ),
      );
    } catch (error) {
      console.error('error', error);

      return error;
    }
  }

  logout(reqDto: LogoutReqDto): Promise<LogoutResDto> {
    return firstValueFrom(
      this.authClient.send(kafkaTopic.AUTH.LOGOUT, JSON.stringify(reqDto)),
    );
  }

  register(reqDto: RegisterReqDto): Promise<RegisterResDto> {
    return firstValueFrom(
      this.authClient.send(kafkaTopic.AUTH.REGISTER, JSON.stringify(reqDto)),
    );
  }

  setCookie(res: Response, accessToken: string, refreshToken: string) {
    console.log({
      accessToken,
      refreshToken,
    });

    res.cookie(ACCESS_JWT_COOKIE_NAME, accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: toMs(ACCESS_JWT_DEFAULT_TTL),
    });
    res.cookie(REFRESH_JWT_COOKIE_NAME, refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: toMs(REFRESH_JWT_DEFAULT_TTL),
    });
  }
}
