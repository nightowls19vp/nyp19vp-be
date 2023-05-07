import {
  ApiProperty,
  IntersectionType,
  OmitType,
  PickType,
} from '@nestjs/swagger';
import { IsString, IsInt, IsPositive, IsAscii } from 'class-validator';
import { BaseResDto, IdDto } from '../base.dto';

export class PackageDto {
  @ApiProperty({
    type: String,
    minLength: 3,
    maxLength: 30,
    uniqueItems: true,
    nullable: false,
    required: true,
    example: 'Package No.1',
    description: 'Name of Package, must be an ascii string',
  })
  @IsString()
  @IsAscii()
  name: string;

  @ApiProperty({
    type: Number,
    minimum: 30,
    required: true,
    description: 'Duration of package; unit: date',
  })
  @IsInt()
  @IsPositive()
  duration: number;

  @ApiProperty({ required: true })
  @IsPositive()
  price: number;

  @ApiProperty({ required: true, minimum: 1 })
  @IsInt()
  @IsPositive()
  noOfMember: number;

  @ApiProperty({
    type: String,
    minLength: 3,
    maxLength: 1000,
    nullable: true,
  })
  @IsString()
  description: string;

  @ApiProperty()
  createdBy: string;

  @ApiProperty()
  updatedBy: string;
}

export class CreatePkgReqDto extends OmitType(PackageDto, ['updatedBy']) {}

export class CreatePkgResDto extends BaseResDto {}

export class UpdatePkgReqDto extends IntersectionType(
  IdDto,
  OmitType(PackageDto, ['createdBy'])
) {}

export class UpdatePkgResDto extends BaseResDto {}

export class GetPkgResDto extends BaseResDto {
  @ApiProperty()
  package: PackageDto;
}

export class FilterPkgReqDto extends PickType(PackageDto, [
  'duration',
  'noOfMember',
]) {
  @ApiProperty({ minimum: 100000, maximum: 500000 })
  @IsPositive()
  price_lb: number;

  @ApiProperty({ minimum: 100000, maximum: 500000 })
  @IsPositive()
  price_gb: number;
}
