import { ApiProperty, PickType, IntersectionType } from '@nestjs/swagger';
import { Transform, TransformFnParams, Type } from 'class-transformer';
import {
  IsArray,
  IsAscii,
  IsEnum,
  IsISO8601,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { BaseResDto, IdDto } from '../base.dto';
import { ObjectId } from 'mongodb';
import { Items } from '../users/users-crud.dto';

export class MemberDto {
  @ApiProperty({
    type: String,
    nullable: true,
    required: true,
  })
  @Transform((v: TransformFnParams) => new ObjectId(v.value))
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
  @IsOptional()
  role?: string;

  @ApiProperty({
    type: String,
    description: 'User ID',
    nullable: true,
    required: false,
  })
  @Transform((v: TransformFnParams) => new ObjectId(v.value))
  @IsOptional()
  addedBy?: string;
}

class PkgDto extends PickType(Items, ['duration', 'noOfMember']) {
  @ApiProperty({
    required: true,
    description: 'Package ID',
    example: '646095c6a962a5a8f865aa77',
  })
  _id: string;
}

class GrPkgDto {
  @ApiProperty()
  @ValidateNested()
  @Type(() => PkgDto)
  package: PkgDto;

  @ApiProperty({ type: Date })
  @IsISO8601()
  startDate: Date;

  @ApiProperty({ type: Date })
  @IsISO8601()
  endDate: Date;

  @ApiProperty({ type: String })
  remainingTime: string;

  @ApiProperty({
    type: String,
    enum: ['Active', 'Expired', 'Not Activated'],
    required: true,
  })
  @IsEnum(['Active', 'Expired', 'Not Activated'])
  status: string;
}

export class GroupDto extends IdDto {
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

  @ApiProperty({
    description: 'Avatar of group. Only supported upload file',
    required: false,
  })
  @IsUrl()
  @IsOptional()
  avatar?: string;

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

class CreateGrReqDto_Pkg extends PkgDto {
  @ApiProperty({
    description: 'Quantity of package',
    type: Number,
    minimum: 1,
    example: 1,
  })
  quantity: number;
}

export class CreateGrReqDto {
  @ApiProperty({
    example: [
      {
        duration: 12,
        noOfMember: 4,
        quantity: 2,
        _id: '646095c6a962a5a8f865aa77',
      },
    ],
  })
  @ValidateNested({ each: true })
  @Type(() => CreateGrReqDto_Pkg)
  packages: CreateGrReqDto_Pkg[];

  @ApiProperty({
    example: {
      user: '6425a5f3f1757ad283e82b23',
    },
  })
  @ValidateNested()
  @Type(() => MemberDto)
  member: MemberDto;
}

export class CreateGrResDto extends BaseResDto {}

export class GetGrResDto extends BaseResDto {
  @ApiProperty()
  @ValidateNested()
  @Type(() => GroupDto)
  group: GroupDto;
}

export class GetGrsByUserResDto extends BaseResDto {
  @ApiProperty()
  @ValidateNested({ each: true })
  @Type(() => GroupDto)
  groups: GroupDto[];
}

export class UpdateGrReqDto extends IntersectionType(
  IdDto,
  PickType(GroupDto, ['name']),
) {}

export class UpdateGrResDto extends BaseResDto {}

export class ActivateGrPkgReqDto extends IntersectionType(
  IdDto,
  PickType(GrPkgDto, ['package']),
) {}

export class AddGrMbReqDto extends IntersectionType(
  IdDto,
  PickType(MemberDto, ['user', 'addedBy']),
) {}

export class RmGrMbReqDto extends IntersectionType(
  IdDto,
  PickType(MemberDto, ['user']),
) {}

export class UpdateGrMbResDto extends BaseResDto {}

export class UpdateGrPkgReqDto extends IdDto {
  package: GrPkgDto;
}

export class UpdateGrPkgResDto extends BaseResDto {}
