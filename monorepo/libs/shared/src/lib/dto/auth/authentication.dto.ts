import { ApiProperty } from '@nestjs/swagger';

import { BaseResDto } from '../base.dto';

export class LoginReqDto {
  username: string;
  password: string;
}

export class LoginResDto extends BaseResDto {}

export class LogoutReqDto {
  username: string;
  password: string;
}

export class LogoutResDto extends BaseResDto {}

export class RegisterReqDto {
  @ApiProperty({
    minLength: 5,
    maxLength: 255,
    nullable: false,
  })
  username: string;

  @ApiProperty({
    minLength: 8,
    maxLength: 255,
    nullable: false,
  })
  password: string;
  name: string;
  phone: string;
  email: string;
}

export class RegisterResDto extends BaseResDto {}
