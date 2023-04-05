import { ApiProperty, PickType, IntersectionType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsAscii,
  IsEnum,
  IsISO8601,
  IsString,
  ValidateNested,
} from 'class-validator';
import { BaseResDto } from '../base.dto';
import { IdDto, PackageDto } from './pkg-crud.dto';

class MemberDto {
  @ApiProperty({
    type: String,
    nullable: true,
    required: true,
  })
  user: string;

  @ApiProperty({
    type: String,
    enum: ['User', 'Super User'],
    example: 'User',
    nullable: true,
    required: true,
    default: 'User',
  })
  @IsEnum(['User', 'Super User'])
  role: string;

  @ApiProperty({
    type: String,
    description: 'User ID',
    nullable: true,
    required: false,
  })
  addedBy: string;
}

class GrPkgDto {
  @ApiProperty()
  @ValidateNested()
  @Type(() => PackageDto)
  package: PackageDto;

  @ApiProperty({
    type: Date,
  })
  @IsISO8601()
  startDate: Date;

  @ApiProperty({
    type: Date,
  })
  @IsISO8601()
  endDate: Date;

  @ApiProperty({
    type: String,
  })
  remainingTime: string;

  @ApiProperty({
    type: String,
    enum: ['Active', 'Expired', 'Not Activated'],
    required: true,
  })
  @IsEnum(['Active', 'Expired', 'Not Activated'])
  status: string;
}

export class GroupDto {
  @ApiProperty({
    type: String,
    minLength: 3,
    maxLength: 30,
    uniqueItems: true,
    nullable: false,
    required: true,
    example: 'Group No.1',
    description: 'Name of group, must be an ascii string',
  })
  @IsString()
  @IsAscii()
  name: string;

  @ApiProperty()
  @ValidateNested()
  @Type(() => GrPkgDto)
  @IsArray()
  packages: GrPkgDto[];

  @ApiProperty()
  @ValidateNested()
  @Type(() => MemberDto)
  @IsArray()
  members: MemberDto[];
}

export class CreateGrReqDto extends PickType(GroupDto, ['name']) {
  @ApiProperty({
    example: {
      packageId: '',
      startDate: new Date(),
    },
  })
  package: {
    packageId: string;
    startDate: Date;
  };

  @ApiProperty({
    example: [
      {
        user: '',
        role: 'Super User',
      },
    ],
  })
  @ValidateNested()
  @Type(() => MemberDto)
  member: MemberDto;
}

export class CreateGrResDto extends BaseResDto {}

export class GetGrsResDto extends BaseResDto {
  @ApiProperty()
  groups: GroupDto[];
}

export class GetGrResDto extends BaseResDto {
  @ApiProperty()
  group: GroupDto;
}

export class UpdateGrReqDto extends IntersectionType(
  IdDto,
  PickType(GroupDto, ['name'])
) {}

export class UpdateGrResDto extends BaseResDto {}

export class AddGrMbReqDto extends IntersectionType(
  IdDto,
  PickType(MemberDto, ['user', 'addedBy'])
) {}

export class RmGrMbReqDto extends IntersectionType(
  IdDto,
  PickType(MemberDto, ['user'])
) {}

export class UpdateGrMbResDto extends BaseResDto {}

export class UpdateGrPkgReqDto extends IdDto {
  package: GrPkgDto;
}

export class UpdateGrPkgResDto extends BaseResDto {}