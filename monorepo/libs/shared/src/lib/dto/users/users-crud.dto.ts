import { ApiProperty, IntersectionType, OmitType, PartialType, PickType } from '@nestjs/swagger';
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
  stockNoti: boolean;

  @ApiProperty({
    type: Boolean,
    default: true,
  })
  @IsBoolean()
  callNoti: boolean;

  @ApiProperty({
    type: Boolean,
    default: true,
  })
  @IsBoolean()
  msgNoti: boolean;

  @ApiProperty({
    type: Boolean,
    default: true,
  })
  @IsBoolean()
  newsNoti: boolean;
}

class UserInfo {
  @ApiProperty()
  _id: string;

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
  dob: Date;

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
  avatar: string;
}

class UserInfoWithoutId extends OmitType(UserInfo, ['_id']) {}

class UserId{
  @ApiProperty()
  _id: string;
}

class UserTimestamp{
  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

class UserInfoDto extends PartialType(UserTimestamp){
  @ApiProperty()
  @Type(() => UserInfoWithoutId)
  @ValidateNested()
  user: UserInfoWithoutId;
}

class UserSettingDto extends PartialType(UserTimestamp){
  @ApiProperty()
  @Type(() => UserSetting)
  @ValidateNested()
  setting: UserSetting;
}

export class UserDto extends PartialType(UserInfoDto){
  @ApiProperty()
  @Type(() => UserSetting)
  @ValidateNested()
  setting: UserSetting;
}

export class UsersDto{
  @ApiProperty()
  @Type(() => UserSetting)
  @ValidateNested()
  users: UserDto[]
}

export class GetUsersResDto extends IntersectionType(BaseResDto, UsersDto) {}

export class GetUserInfoResDto extends IntersectionType(BaseResDto, UserInfoDto) {}

export class GetUserSettingResDto extends IntersectionType(BaseResDto, UserSettingDto) {}

export class CreateUserReqDto extends OmitType(UserInfo, ['_id', 'avatar']) {}

export class CreateUserResDto extends BaseResDto {}

export class UpdateUserReqDto extends OmitType(UserInfo, ['email', 'avatar']) {}

export class UpdateUserResDto extends BaseResDto {}

export class UpdateSettingReqDto extends IntersectionType(UserId, UserSetting){}

export class UpdateSettingResDto extends BaseResDto {}

export class UpdateAvatarReqDto extends PickType(UserInfo, ['_id','avatar']) {}

export class UpdateAvatarResDto extends BaseResDto {}
