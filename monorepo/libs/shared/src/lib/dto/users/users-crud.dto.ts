import { ApiProperty, IntersectionType, OmitType, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsEmail, IsNumberString } from 'class-validator';
import { IsBoolean, IsString, ValidateNested } from 'class-validator';
import { BaseResDto } from '../base.dto';

export class UserId {
  _id: string
}

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

class Items {
  @ApiProperty({
      type: String
  })
  package: string;

  @ApiProperty({
      type: Number,
      minimum: 1,
  })
  quantity: number;

  @ApiProperty({
      type: Float64Array
  })
  price: number;
}

class UserInfoDto {
  @ApiProperty()
  @Type(() => UserInfo)
  @ValidateNested()
  user: UserInfo;
}

class UserSettingDto {
  @ApiProperty()
  @Type(() => UserSetting)
  @ValidateNested()
  setting: UserSetting;
}

export class UsersDto{
  @ApiProperty()
  @Type(() => UserSetting)
  @ValidateNested()
  users: UserInfo[]
}

class ShoppingHistoryDto {
  @ApiProperty({
      type: Array<string>
  })
  @IsArray()
  transaction: string[]
}

export class CartDto {
  @ApiProperty()
  @Type(() => Items)
  @ValidateNested()
  cart: Items[]
}

export class GetUsersResDto extends IntersectionType(BaseResDto, UsersDto) {}

export class GetUserInfoResDto extends IntersectionType(BaseResDto, UserInfoDto) {}

export class GetUserSettingResDto extends IntersectionType(BaseResDto, UserSettingDto) {}

export class CreateUserReqDto extends OmitType(UserInfo, ['avatar']) {}

export class CreateUserResDto extends BaseResDto {}

export class UpdateUserReqDto extends IntersectionType(UserId, OmitType(UserInfo, ['email', 'avatar'])) {}

export class UpdateUserResDto extends BaseResDto {}

export class UpdateSettingReqDto extends IntersectionType(UserId, UserSetting){}

export class UpdateSettingResDto extends BaseResDto {}

export class UpdateAvatarReqDto extends IntersectionType(UserId, PickType(UserInfo, ['avatar'])) {}

export class UpdateAvatarResDto extends BaseResDto {}

export class GetCartResDto extends IntersectionType(BaseResDto, CartDto) {}

export class GetShoppingHistoryResDto extends IntersectionType(BaseResDto, ShoppingHistoryDto) {}

export class UpdateCartReqDto extends IntersectionType(UserId, CartDto) {}

export class UpdateCartResDto extends BaseResDto {}

export class AddToHistoryReqDto extends IntersectionType(UserId, ShoppingHistoryDto) {}

export class AddToHistoryResDto extends BaseResDto {}
