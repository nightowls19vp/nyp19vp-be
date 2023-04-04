import { Response } from 'express';
import { firstValueFrom } from 'rxjs';

import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import {
  ERole,
  kafkaTopic,
  LoginReqDto,
  LoginResWithTokensDto,
  LogoutReqDto,
  LogoutResDto,
  RegisterReqDto,
  RegisterResDto,
  SocialSignupReqDto,
  SocialSignupResDto,
  ValidateUserReqDto,
  ValidateUserResDto,
  AuthorizeReqDto,
  AuthorizeResDto,
  UserDto,
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
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientKafka,
    private readonly userService: UsersService,
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

  /** Validate that have this Google Account been registered
   * If not do sign up
   * @param googleUser
   * @returns user
   */
  async googleUserValidate(googleUser: {
    provider: string;
    providerId: string;
    name: string;
    email: string;
    photo: string;
    accessToken: string;
    refreshToken: string;
  }): Promise<UserDto> {
    console.log('gg vlt user', googleUser);

    const socialSignupReqDto: SocialSignupReqDto = {
      platform: googleUser.provider,
      platformId: googleUser.providerId,
      name: googleUser.name,
      email: googleUser.email,
      photo: googleUser.photo,
    };

    const resDto: SocialSignupResDto = await firstValueFrom(
      this.authClient.send(
        kafkaTopic.AUTH.SOCIAL_SIGN_UP,
        JSON.stringify(socialSignupReqDto),
      ),
    );

    return resDto as any;
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
}
