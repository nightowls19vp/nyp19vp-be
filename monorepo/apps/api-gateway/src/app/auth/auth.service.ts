import { resolve } from 'path';
import { Response } from 'express';
import { firstValueFrom, timeout } from 'rxjs';

import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import {
  ERole,
  kafkaTopic,
  LoginReqDto,
  LoginResWithTokensDto,
  LogoutReqDto,
  LogoutResDto,
  CreateAccountReqDto,
  CreateAccountResDto,
  SocialSignupReqDto,
  SocialSignupResDto,
  ValidateUserReqDto,
  ValidateUserResDto,
  AuthorizeReqDto,
  AuthorizeResDto,
  ELoginType,
  IUser,
  RefreshTokenResDto,
  RefreshTokenReqDto,
} from '@nyp19vp-be/shared';

import {
  ACCESS_JWT_COOKIE_NAME,
  ACCESS_JWT_DEFAULT_TTL,
  REFRESH_JWT_COOKIE_NAME,
  REFRESH_JWT_DEFAULT_TTL,
} from './constants/authentication';
import { toMs } from './utils/ms';

import { ISocialUser } from './interfaces/social-user.interface';

@Injectable()
export class AuthService {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientKafka,
  ) {}

  /** Validate that have this Google Account been registered
   * If not do sign up
   * @param googleUser
   * @returns user
   */
  async googleSignUp(googleUser: ISocialUser): Promise<SocialSignupResDto> {
    const socialSignupReqDto: SocialSignupReqDto = {
      platform: googleUser.provider,
      platformId: googleUser.providerId,
      name: googleUser.name,
      email: googleUser.email,
      photo: googleUser.photo,
    };

    try {
      const resDto: SocialSignupResDto = await firstValueFrom(
        this.authClient
          .send(
            kafkaTopic.AUTH.SOCIAL_SIGN_UP,
            JSON.stringify(socialSignupReqDto),
          )
          .pipe(timeout(toMs('5s'))),
      );
      console.log('resDto success', resDto);
      return resDto;
    } catch (error) {
      console.error('timeout', error);

      return null;
    }
  }

  /**
   * Validate a user by his/her username(email)/password. Return `IUser` if success else `null`
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
        this.authClient.send(kafkaTopic.AUTH.LOGIN, JSON.stringify(reqDto)),
      );
    } catch (error) {
      console.error('error', error);

      return error;
    }
  }

  async logout(reqDto: LogoutReqDto): Promise<LogoutResDto> {
    return firstValueFrom(
      this.authClient
        .send(kafkaTopic.AUTH.LOGOUT, JSON.stringify(reqDto))
        .pipe(timeout(toMs('5s'))),
    );
  }

  register(reqDto: CreateAccountReqDto): Promise<CreateAccountResDto> {
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

  async authorize(
    accessToken: string,
    requiredRoles: ERole[],
  ): Promise<boolean> {
    const authorizeReqDto: AuthorizeReqDto = {
      jwt: accessToken,
      roles: requiredRoles,
    };

    return true;

    const authorizeResult: AuthorizeResDto = await firstValueFrom(
      this.authClient.send(
        kafkaTopic.AUTH.AUTHORIZE,
        JSON.stringify(authorizeReqDto),
      ),
    );

    return authorizeResult.result;
  }

  async refresh(token: string): Promise<RefreshTokenResDto> {
    const reqDto: RefreshTokenReqDto = {
      refreshToken: token,
    };

    try {
      const resDto: RefreshTokenResDto = await firstValueFrom(
        this.authClient
          .send(kafkaTopic.AUTH.REFRESH, reqDto)
          .pipe(timeout(toMs('5s'))),
      );

      return resDto;
    } catch (error) {
      console.error('timeout', error);

      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal Server Error',
        error: error.message,
      };
    }
  }
}
