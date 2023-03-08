import { PickType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { SwaggerEnumType } from '@nestjs/swagger/dist/types/swagger-enum.type';
import {
  ArrayMinSize,
  ArrayNotEmpty,
  IsEnum,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';
import { BaseResDto } from '../base.dto';

export class CreateGrReqDto {
  id: string;

  @ApiProperty({
    minLength: 3,
    maxLength: 30,
    nullable: false,
    required: true,
  })
  @IsString()
  name: string;

  @ApiProperty({
    required: true,
  })
  admin: string;

  @ApiProperty({
    required: true,
  })
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  members: string[];

  @ApiProperty({
    required: true,
  })
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  listPkg: object[];

  @ApiProperty({
    required: true,
  })
  @ValidateNested()
  @IsObject()
  curPkg: object;
}

export class CreateGrResDto extends BaseResDto {}

export class UpdateGrReqDto extends PickType(CreateGrReqDto, [
  'name',
  'members',
] as const) {}

export class UpdateGrResDto extends BaseResDto {}

export class CreateGrPkgReqDto {
  id: string;

  @ApiProperty({
    required: true,
  })
  @ValidateNested()
  @IsObject()
  package: object;

  @ApiProperty({
    required: true,
  })
  startedAt: Date;

  @ApiProperty({
    required: true,
  })
  endAt: Date;

  @ApiProperty({
    required: true,
  })
  remainingTime: Date;

  @ApiProperty({
    required: true,
  })
  @IsEnum(['Active', 'Expired', 'Not Activated'])
  state: SwaggerEnumType;
}

export class CreateGrPkgResDto extends BaseResDto {}
