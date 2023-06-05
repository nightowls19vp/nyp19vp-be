import { ApiProperty } from '@nestjs/swagger';
import { ProductDto } from '../dto/product.dto';
import { BaseResDto } from '../../base.dto';
import { GroupProductDto } from '../dto/group-product.dto';
import { PartialType } from '@nestjs/mapped-types';

export class CreateGroupProductReqDto extends PartialType(ProductDto) {
  @ApiProperty()
  groupMongoId: string;

  @ApiProperty({})
  productId: string;
}

export class CreateGroupProductResDto extends BaseResDto {
  data?: GroupProductDto;
}
