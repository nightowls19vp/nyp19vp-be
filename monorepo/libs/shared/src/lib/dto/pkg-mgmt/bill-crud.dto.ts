import {
  ApiProperty,
  IntersectionType,
  OmitType,
  PickType,
} from '@nestjs/swagger';
import { Transform, TransformFnParams, Type } from 'class-transformer';
import { IsEnum, IsOptional, ValidateNested } from 'class-validator';
import { ObjectId } from 'mongodb';
import { IdDto } from '../base.dto';

class BorrowerDto {
  @ApiProperty({
    type: String,
    nullable: true,
    required: true,
    example: '648a7dff13638f64bbf9c156',
  })
  @Transform((v: TransformFnParams) => new ObjectId(v.value))
  user: string;

  @ApiProperty({ type: Number, required: true, minimum: 1000, example: 10000 })
  amount: number;

  @IsOptional()
  @IsEnum(['APPROVED', 'PENDING', 'CANCELED'])
  status?: string;
}

class BillingDto {
  @ApiProperty({ type: String, nullable: true, required: true })
  summary: string;

  @ApiProperty({ type: Date, required: false })
  @IsOptional()
  date?: Date;

  @ApiProperty({
    example: [{ user: '648a7dff13638f64bbf9c156', amount: 10000 }],
  })
  @Type(() => BorrowerDto)
  @ValidateNested({ each: true })
  borrowers: BorrowerDto[];

  @ApiProperty({ type: String, nullable: true, required: true })
  @Transform((v: TransformFnParams) => new ObjectId(v.value))
  lender: string;

  amount: number;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  description?: string;

  createdBy: string;

  updatedBy: string;
}

export class CreateBillReqDto extends IntersectionType(
  IdDto,
  OmitType(BillingDto, ['updatedBy']),
) {}

export class UpdateBillReqDto extends IntersectionType(
  IdDto,
  OmitType(BillingDto, ['createdBy']),
) {}

class UpdateBorrowSttReqDto extends PickType(BorrowerDto, ['user']) {
  @ApiProperty({ enum: ['APPROVED', 'PENDING', 'CANCELED'] })
  @IsEnum(['APPROVED', 'PENDING', 'CANCELED'])
  status: string;
}
export class UpdateBillSttReqDto extends IntersectionType(
  IdDto,
  PickType(BillingDto, ['updatedBy']),
) {
  @ApiProperty({
    example: [{ user: '648a7dff13638f64bbf9c156', status: 'PENDING' }],
  })
  @Type(() => UpdateBorrowSttReqDto)
  @ValidateNested({ each: true })
  borrowers: UpdateBorrowSttReqDto[];
}
