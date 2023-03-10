import { IntersectionType, PickType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEmail, IsNumberString } from 'class-validator';
import { IsBoolean, IsString, ValidateNested } from 'class-validator';
import { BaseResDto } from '../base.dto';

class UserSetting {
  @ApiProperty({
    type: Boolean,
    default: true,
  })
  @IsBoolean()
  stockNoti: boolean

  @ApiProperty({
    type: Boolean,
    default: true,
  })
  @IsBoolean()
  callNoti: boolean

  @ApiProperty({
    type: Boolean,
    default: true,
  })
  @IsBoolean()
  msgNoti: boolean

  @ApiProperty({
    type: Boolean,
    default: true,
  })
  @IsBoolean()
  newsNoti: boolean
}

export class CreateUserReqDto {
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
}

export class UserIdDto {
  _id: string
}

export class CreateUserResDto extends BaseResDto {}

export class UpdateInfoReqDto extends PickType(CreateUserReqDto, ['name', 'dob', 'phone']) {}

export class UpdateUserReqDto extends IntersectionType(
  UpdateInfoReqDto,
  UserIdDto
){}

export class UpdateUserResDto extends BaseResDto {}

export class UpdateSettingReqDto{
  @ApiProperty()
  @Type(() => UserSetting)
  @ValidateNested()
  setting: UserSetting
}

export class UpdateUserSettingReqDto extends IntersectionType(
  UpdateSettingReqDto,
  UserIdDto
){}

export class UpdateUserSettingResDto extends BaseResDto {}

export class UpdateAvatarReqDto {
  @ApiProperty()
  avatar: bigint
}

export class UpdateAvatarResDto extends BaseResDto {}
