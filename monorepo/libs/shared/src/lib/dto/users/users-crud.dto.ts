import {
  ApiProperty,
  IntersectionType,
  OmitType,
  PickType,
} from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsAscii,
  IsDateString,
  IsEmail,
  IsPhoneNumber,
} from 'class-validator';
import { IsBoolean, IsString, ValidateNested } from 'class-validator';
import { BaseResDto } from '../base.dto';

export class UserId {
  _id: string;
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

export class UserInfo {
  @ApiProperty({
    description: 'name of user, must be an ascii string',
    type: String,
    example: 'night owl',
    required: true,
    nullable: false,
    minLength: 1,
    maxLength: 255,
  })
  @IsString()
  @IsAscii()
  name: string;

  @ApiProperty({
    description: 'date of birth of user',
    type: Date,
    example: '2001-01-01',
  })
  @IsDateString()
  dob: Date;

  @ApiProperty({
    description:
      'phone number of user, must be an valid VIETNAMESE phone number',
    example: '0987654321',
    minimum: 10,
    maximum: 12,
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

  @ApiProperty({
    description: 'Avatar of user. It could be embbed link or upload file',
  })
  avatar: string;
}

class Items {
  @ApiProperty({
    description: 'Package ID',
    type: String,
    example: '640ac2ccf227ec441cd97d7b',
  })
  package: string;

  @ApiProperty({
    description: 'Quantity of package',
    type: Number,
    minimum: 1,
    example: 1,
  })
  quantity: number;

  @ApiProperty({
    description: 'Price of package at that moment',
    type: Number,
    example: 20.1,
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

export class UsersDto {
  @ApiProperty()
  @Type(() => UserSetting)
  @ValidateNested()
  users: UserInfo[];
}

class ShoppingHistoryDto {
  @ApiProperty({
    type: Array<string>,
  })
  @IsArray()
  transaction: string[];
}

export class CartDto {
  @ApiProperty({
    example: [
      {
        package: '640ac2ccf227ec441cd97d7b',
        quantity: 1,
        price: 17.5,
      },
      {
        package: '640b22084096fa00812fa128',
        quantity: 2,
        price: 20.1,
      },
    ],
  })
  @Type(() => Items)
  @ValidateNested()
  cart: Items[];
}

export class TrxHistDto {
  @ApiProperty()
  trx: string[];
}

export class GetTrxHistResDto extends IntersectionType(
  BaseResDto,
  TrxHistDto
) {}

export class UpdateTrxHistReqDto extends UserId {
  @ApiProperty({
    description: 'Transaction Id paid by user',
  })
  trx: string;
}

export class UpdateTrxHistResDto extends BaseResDto {}

export class GetUsersResDto extends IntersectionType(BaseResDto, UsersDto) {}

export class GetUserInfoResDto extends IntersectionType(
  BaseResDto,
  UserInfoDto
) {}

export class GetUserSettingResDto extends IntersectionType(
  BaseResDto,
  UserSettingDto
) {}

export class CreateUserReqDto extends OmitType(UserInfo, ['avatar']) {}

export class CreateUserResDto extends BaseResDto {}

export class UpdateUserReqDto extends IntersectionType(
  UserId,
  OmitType(UserInfo, ['email', 'avatar'])
) {}

export class UpdateUserResDto extends BaseResDto {}

export class UpdateSettingReqDto extends IntersectionType(
  UserId,
  UserSetting
) {}

export class UpdateSettingResDto extends BaseResDto {}

export class UpdateAvatarReqDto extends IntersectionType(
  UserId,
  PickType(UserInfo, ['avatar'])
) {}

export class UpdateAvatarResDto extends BaseResDto {}

export class GetCartResDto extends IntersectionType(BaseResDto, CartDto) {}

export class GetShoppingHistoryResDto extends IntersectionType(
  BaseResDto,
  ShoppingHistoryDto
) {}

export class UpdateCartReqDto extends IntersectionType(UserId, CartDto) {}

export class UpdateCartResDto extends BaseResDto {}

export class AddToHistoryReqDto extends IntersectionType(
  UserId,
  ShoppingHistoryDto
) {}

export class AddToHistoryResDto extends BaseResDto {}
