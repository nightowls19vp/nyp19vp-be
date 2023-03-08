import { OmitType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEmail, IsNumberString } from 'class-validator';
import { IsBoolean, IsString, ValidateNested } from 'class-validator';
import { BaseResDto } from '../base.dto';

class UserSetting {
  @ApiProperty({
    type: Boolean,
    default: true,
    required: true
  })
  @IsBoolean()
  readonly isProdOutOfStock: boolean

  @ApiProperty({
    type: Boolean,
    default: true,
    required: true
  })
  @IsBoolean()
  readonly isGetCallNoti: boolean

  @ApiProperty({
    type: Boolean,
    default: true,
    required: true
  })
  @IsBoolean()
  readonly isGetMsgNoti: boolean

  @ApiProperty({
    type: Boolean,
    default: true,
    required: true
  })
  @IsBoolean()
  readonly isGetNewsNoti: boolean
}


export class CreateUserReqDto {
  id: number;

  @ApiProperty({
    type: String,
    minLength: 3,
    maxLength: 30,
    uniqueItems: true,
    required: true
  })
  @IsString()
  name: string;

  @ApiProperty({
    type: Date
  })
  dob: Date

  @ApiProperty()
  @IsNumberString()
  phone: string;

  @ApiProperty({
    type: String,
    uniqueItems: true,
    required: true
  })
  @IsEmail()
  email: string;

  @Type(() => UserSetting)
  @ValidateNested()
  setting: UserSetting
}

export class CreateUserResDto extends BaseResDto {}

export class UpdateUserReqDto extends OmitType(CreateUserReqDto, ['email'] as const) {}

export class UpdateUserResDto extends BaseResDto {}

export class UpdateUserSettingReqDto{
  @ApiProperty()
  @Type(() => UserSetting)
  @ValidateNested()
  setting: UserSetting
}

export class UpdateUserSettingResDto extends BaseResDto {}

export class UpdateAvatarReqDto {
  @ApiProperty()
  img: bigint
}

export class UpdateAvatarResDto extends BaseResDto {}
