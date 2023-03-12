import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsAlphanumeric,
  IsAscii,
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
  Matches,
  NotContains,
} from 'class-validator';
import { IsNull, Not } from 'typeorm';

import { BaseResDto } from '../base.dto';

class LocalAuthenInfo {
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
    description: `Password strength criteria:\n\n\t- Number of characters must be between 8 to 255.\n\n\t- Contain at least 1 charactor in Upper Case\n\n\t- Contain at least 1 Special Character (!, @, #, $, &, *)\n\n\t-  Contain at least 1 numeral (0-9)\n\n\t-  Contain at least 1 letters in lower case`,
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

export class LoginReqDto {
  @ApiProperty({
    description: `Username must:\n\n\t- Only contains alphanumeric characters, underscore and dot.\n\n\t- Underscore and dot can't be at the end or start of a username (e.g _username / username_ / .username / username.).\n\n\t- Underscore and dot can't be next to each other (e.g user_.name).\n\n\t- Underscore or dot can't be used multiple times in a row (e.g user__name / user..name).\n\n\t- Number of characters must be between 8 to 255.\n\n\t`,
    minLength: 5,
    maxLength: 255,
    nullable: false,
    example: 'username_example',
    pattern: '^(?=.{8,255}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$',
  })
  @Matches('^(?=.{8,255}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$')
  username: string;
  @ApiProperty({
    description: `Password strength criteria:\n\n\t- Number of characters must be between 8 to 255.\n\n\t- Contain at least 1 charactor in Upper Case\n\n\t- Contain at least 1 Special Character (!, @, #, $, &, *)\n\n\t-  Contain at least 1 numeral (0-9)\n\n\t-  Contain at least 1 letters in lower case`,
    nullable: false,
    example: 'password_example',
    pattern: '^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,255}$',
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

export class LoginResDto extends BaseResDto {}

export class LogoutReqDto {}

export class LogoutResDto extends BaseResDto {}

export class RegisterReqDto extends LocalAuthenInfo {
  @ApiProperty({
    description: 'name of user, must be an ascii string',
    example: 'night owl',
    required: true,
    nullable: false,
    minLength: 1,
    maxLength: 255,
  })
  @IsAscii()
  name: string;

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

export class RegisterResDto extends BaseResDto {
  //fixme
}
