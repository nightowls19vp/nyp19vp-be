import { Response } from 'express';
import { firstValueFrom } from 'rxjs';

import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import {
  kafkaTopic,
  LoginReqDto,
  LoginResWithTokensDto,
  LogoutReqDto,
  LogoutResDto,
  RegisterReqDto,
  RegisterResDto,
  ValidateUserReqDto,
  ValidateUserResDto,
} from '@nyp19vp-be/shared';

import {
  ACCESS_JWT_COOKIE_NAME,
  ACCESS_JWT_DEFAULT_TTL,
  REFRESH_JWT_COOKIE_NAME,
  REFRESH_JWT_DEFAULT_TTL,
} from './constants/authentication';
import { toMs } from './utils/ms';
import { ELoginType, IUser } from 'libs/shared/src/lib/core/interfaces';

import { Request } from 'express';

@Injectable()
export class AuthService {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientKafka,
  ) {}

  googleLogin(req: Request) {
    if (!req.user) {
      return 'No user from google';
    }

    return {
      message: 'User information from google',
      user: req.user,
    };
  }

  googleUserValidate(googleUser: {
    provider: string;
    providerId: string;
    name: string;
    email: string;
    photo: string;
    accessToken: string;
    refreshToken: string;
  }) {
    console.log('gg vlt user', googleUser);

    const testUser: IUser = {
      username: googleUser.email,
      password: null,
    };

    return testUser;
  }

  /**
   * Validate a user by his/her username(email)/password. Return `IUser` if sucess else `null`
   * @param username username, email
   * @param password password
   * @param loginType enum value `username` or `email`
   * @returns `IUser` if sucess else `null`
   */
  async validateUser(
    username: string,
    password: string,
    loginType: ELoginType,
  ): Promise<IUser> {
    const validateUserReqDto: ValidateUserReqDto = {
      username,
      password,
      loginType,
    };

    this.authClient.send(
      kafkaTopic.AUTH.VALIDATE_USER,
      JSON.stringify(validateUserReqDto),
    );

    const validateUserResDto: ValidateUserResDto = await firstValueFrom(
      this.authClient.send(
        kafkaTopic.AUTH.VALIDATE_USER,
        JSON.stringify(validateUserReqDto),
      ),
    );

    if (validateUserResDto.statusCode === HttpStatus.OK) {
      return validateUserResDto.user;
    } else {
      return null;
    }
  }

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
      this.authClient.send(
        kafkaTopic.AUTH.CREATE_ACCOUNT,
        JSON.stringify(reqDto),
      ),
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
