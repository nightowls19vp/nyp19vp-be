import { OmitType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsMobilePhone, IsEmail } from 'class-validator';
import { BaseResDto } from '../base.dto';

export class CreateUserReqDto {
  id: string;

  @ApiProperty({
    minLength: 3,
    maxLength: 30,
    nullable: false,
    required: true
  })
  @IsString()
  name: string;

  @ApiProperty()
  @IsMobilePhone('vi-VN')
  phone: string;

  @ApiProperty({
    required: true
  })
  @IsEmail()
  email: string;
}

export class CreateUserResDto extends BaseResDto {}

export class UpdateUserReqDto extends OmitType(CreateUserReqDto, ['email'] as const) {}

export class UpdateUserResDto extends BaseResDto {}


