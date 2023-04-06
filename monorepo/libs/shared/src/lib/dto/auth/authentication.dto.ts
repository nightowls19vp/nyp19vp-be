import { Transform } from 'class-transformer';
import {
  IsAscii,
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
  Matches,
  NotContains,
} from 'class-validator';

import { ApiProperty, IntersectionType } from '@nestjs/swagger';

import { BaseResDto } from '../base.dto';
import { ELoginType, IUser } from '../../core';

class LocalAuthenticationInfo {
  @ApiProperty({
    description: `Username must:\n\n\t- Only contains alphanumeric characters, underscore and dot.\n\n\t- Underscore and dot can't be at the end or start of a username (e.g _username / username_ / .username / username.).\n\n\t- Underscore and dot can't be next to each other (e.g user_.name).\n\n\t- Underscore or dot can't be used multiple times in a row (e.g user__name / user..name).\n\n\t- Number of characters must be between 8 to 255.\n\n\t`,
    example: 'username_example',
    minLength: 5,
    maxLength: 255,
    nullable: false,
    pattern: '^(?=.{8,255}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$',
  })
  @Matches('^(?=.{8,255}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$')
  username: string;

  @ApiProperty({
    description: `Password strength criteria:\n\n\t- Number of characters must be between 8 to 255.\n\n\t- Contain at least 1 character in Upper Case\n\n\t- Contain at least 1 Special Character (!, @, #, $, &, *)\n\n\t-  Contain at least 1 numeral (0-9)\n\n\t-  Contain at least 1 letters in lower case`,
    example: 'P@s5__.word',
    nullable: false,
    pattern: `^(?=[.\\S]*[A-Z][.\\S]*)(?=[.\\S]*[0-9][.\\S]*)(?=[.\\S]*[a-z][.\\S]*)[.\\S]{8,255}$`,
  })
  @NotContains(' ', {
    message: 'should not contain space',
  })
  @IsStrongPassword({
    minLength: 8,
    minUppercase: 1,
    minLowercase: 1,
    minSymbols: 1,
    minNumbers: 1,
  })
  password: string;
}

class UserInfo {
  @ApiProperty({
    description: `Username must:\n\n\t- Only contains alphanumeric characters, underscore and dot.\n\n\t- Underscore and dot can't be at the end or start of a username (e.g _username / username_ / .username / username.).\n\n\t- Underscore and dot can't be next to each other (e.g user_.name).\n\n\t- Underscore or dot can't be used multiple times in a row (e.g user__name / user..name).\n\n\t- Number of characters must be between 8 to 255.\n\n\t`,
    example: 'username_example',
    minLength: 5,
    maxLength: 255,
    nullable: false,
    pattern: '^(?=.{8,255}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$',
  })
  @Matches('^(?=.{8,255}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$')
  username: string;

  @ApiProperty({
    description: 'name of user, must be an ascii string',
    type: String,
    example: 'night owl',
    required: true,
    nullable: false,
    minLength: 1,
    maxLength: 255,
  })
  @IsAscii()
  name: string;

  @ApiProperty({
    description: 'date of birth',
    type: Date,
    required: false,
    nullable: true,
  })
  @Transform(({ value }) => value && new Date(value))
  @IsDate()
  dob: Date;

  @ApiProperty({
    description:
      'phone number of user, must be an valid VIETNAMESE phone number',
    example: '0987654321',
    required: true,
    nullable: false,
  })
  @Transform(({ value }) => value.replace(/^0/, '+84'))
  @IsPhoneNumber('VI')
  phone: string;

  @ApiProperty({
    description: 'Email of user, must be an ascii string',
    example: 'example@ex.com',
    required: true,
    nullable: false,
    minLength: 1,
    maxLength: 255,
  })
  @IsEmail()
  email: string;
}

export class ValidateUserReqDto extends LocalAuthenticationInfo {
  @IsEnum(ELoginType)
  loginType: ELoginType;
}

export class ValidateUserResDto extends BaseResDto {
  user: IUser;
}

export class LoginReqDto extends LocalAuthenticationInfo {}

export class LoginResDto extends BaseResDto {
  @ApiProperty({
    name: 'access_token',
    type: String,
  })
  accessToken?: string;
}

export class LoginResWithTokensDto extends LoginResDto {
  accessToken?: string;
  refreshToken?: string;
}

export class LogoutReqDto {}

export class LogoutResDto extends BaseResDto {}

export class CreateAccountReqDto extends IntersectionType(
  LocalAuthenticationInfo,
  UserInfo,
) {}

export class CreateAccountResDto extends BaseResDto {}

export class SocialSignupReqDto {
  @IsNotEmpty()
  @IsString()
  platform: string;

  @IsNotEmpty()
  @IsString()
  platformId: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  photo: string;
}

export class SocialSignupResDto extends CreateAccountResDto {
  data?: {
    accessToken?: string;
    refreshToken?: string;
  };

  user: IUser;
}

export class ChangePasswordReqDto extends LocalAuthenticationInfo {
  @ApiProperty({
    description: `The new password. Cannot be the old one.
    \n\nPassword strength criteria:\n\n\t- Number of characters must be between 8 to 255.\n\n\t- Contain at least 1 character in Upper Case\n\n\t- Contain at least 1 Special Character (!, @, #, $, &, *)\n\n\t-  Contain at least 1 numeral (0-9)\n\n\t-  Contain at least 1 letters in lower case`,
    example: 'P@s5__.word',
    nullable: false,
    pattern: `^(?=[.\\S]*[A-Z][.\\S]*)(?=[.\\S]*[0-9][.\\S]*)(?=[.\\S]*[a-z][.\\S]*)[.\\S]{8,255}$`,
  })
  @NotContains(' ', {
    message: 'should not contain space',
  })
  @IsStrongPassword({
    minLength: 8,
    minUppercase: 1,
    minLowercase: 1,
    minSymbols: 1,
    minNumbers: 1,
  })
  newPassword: string;
}

export class ChangePasswordResDto extends BaseResDto {}

// No need for DeleteAccountRes cause accountId to delete will be passed as a param
export class DeleteAccountRes extends BaseResDto {}
