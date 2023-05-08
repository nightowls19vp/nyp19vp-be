import {
  ApiProperty,
  ApiPropertyOptional,
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
  IsOptional,
  IsEnum,
  IsPhoneNumber,
} from 'class-validator';
import { IsBoolean, IsString, ValidateNested } from 'class-validator';
import { BaseResDto, IdDto } from '../base.dto';

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

class FileDto {
  @ApiProperty({ required: true })
  fileName: string;

  @ApiProperty({
    description: "Image's size. Unit: kB",
    type: Number,
    minimum: 1000,
    required: true,
  })
  fileSize: number;

  @ApiProperty({
    type: String,
    enum: ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'],
    required: true,
  })
  @IsEnum(['image/jpeg', 'image/png', 'image/gif', 'image/jpg'])
  contentType: string;

  @ApiProperty({
    type: String,
    enum: ['hex', 'base64'],
    required: true,
  })
  @IsEnum(['hex', 'base64'])
  dataType: string;

  @ApiProperty({ type: String, required: true })
  fileData: string;

  uploadDate: Date;
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
  @IsOptional()
  dob?: Date;

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

  @ApiProperty({ description: 'Avatar of user. Only supported upload file' })
  @Type(() => FileDto)
  @ValidateNested()
  avatar?: FileDto;

  @ApiPropertyOptional()
  @IsString()
  avatarUrl?: string;
}

export class Items {
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
}

class UserSettingDto {
  @ApiProperty()
  @Type(() => UserSetting)
  @ValidateNested()
  setting: UserSetting;
}

export class TrxHistDto {
  @ApiProperty()
  @IsArray()
  @ValidateNested({ each: true })
  trxHist: string[];
}

export class CartDto {
  @ApiProperty({
    example: [
      {
        package: '640ac2ccf227ec441cd97d7b',
        quantity: 1,
      },
      {
        package: '640b22084096fa00812fa128',
        quantity: 2,
      },
    ],
  })
  @Type(() => Items)
  @ValidateNested({ each: true })
  @IsArray()
  cart: Items[];
}

export class UserDto extends IntersectionType(
  UserInfo,
  UserSettingDto,
  TrxHistDto,
  CartDto,
) {}

export class UpdateTrxHistReqDto extends IntersectionType(IdDto, CartDto) {
  @ApiProperty({ description: 'Transaction Id paid by user' })
  trx: string;
}

export class UpdateTrxHistResDto extends BaseResDto {}

export class GetUserInfoResDto extends BaseResDto {
  @ApiProperty()
  @Type(() => UserInfo)
  @ValidateNested()
  user: UserDto;
}

export class GetUserSettingResDto extends IntersectionType(
  BaseResDto,
  UserSettingDto,
) {}

export class CreateUserReqDto extends UserInfo {}

export class CreateUserResDto extends BaseResDto {}

export class UpdateUserReqDto extends IntersectionType(
  IdDto,
  OmitType(UserInfo, ['email', 'avatar']),
) {}

export class UpdateUserResDto extends BaseResDto {}

export class UpdateSettingReqDto extends IntersectionType(IdDto, UserSetting) {}

export class UpdateSettingResDto extends BaseResDto {}

export class UpdateAvatarReqDto extends IntersectionType(
  IdDto,
  PickType(UserInfo, ['avatar']),
) {}

export class UpdateAvatarByFileReqDto extends IntersectionType(
  IdDto,
  PickType(UserInfo, ['avatarUrl']),
) {}

export class UpdateAvatarResDto extends BaseResDto {}

export class GetCartResDto extends IntersectionType(BaseResDto, CartDto) {}

export class UpdateCartReqDto extends IntersectionType(IdDto, CartDto) {}

export class UpdateCartResDto extends BaseResDto {}
