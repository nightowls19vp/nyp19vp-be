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
  readonly stockNoti: boolean

  @ApiProperty({
    type: Boolean,
    default: true,
  })
  @IsBoolean()
  readonly callNoti: boolean

  @ApiProperty({
    type: Boolean,
    default: true,
  })
  @IsBoolean()
  readonly msgNoti: boolean

  @ApiProperty({
    type: Boolean,
    default: true,
  })
  @IsBoolean()
  readonly newsNoti: boolean
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

  @ApiProperty()
  @Type(() => UserSetting)
  @ValidateNested()
  setting: UserSetting
}

export class UserIdDto {
  _id: string
}

export class CreateUserResDto extends BaseResDto {}

export class UpdateReqDto extends PickType(CreateUserReqDto, ['name', 'dob', 'phone']) {}

export class UpdateUserReqDto extends IntersectionType(
  UpdateReqDto,
  UserIdDto
){}

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
  avatar: bigint
}

export class UpdateAvatarResDto extends BaseResDto {}
