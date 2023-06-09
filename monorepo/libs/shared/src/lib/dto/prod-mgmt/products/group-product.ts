import { PaginateQuery, Paginated } from 'nestjs-paginate';
import { ApiProperty } from '@nestjs/swagger';
import { ProductDto } from '../dto/product.dto';
import { BaseResDto } from '../../base.dto';
import { GroupProductDto } from '../dto/group-product.dto';
import { IntersectionType, PartialType } from '@nestjs/mapped-types';

export class CreateGroupProductReqDto extends PartialType(ProductDto) {
  @ApiProperty()
  groupId: string;

  @ApiProperty()
  barcode?: string;

  @ApiProperty()
  brand?: string;

  @ApiProperty()
  category?: string;

  @ApiProperty()
  description?: string;

  @ApiProperty()
  image?: string;

  @ApiProperty()
  name?: string;

  @ApiProperty()
  price?: number;

  @ApiProperty()
  region?: string;
}

export class CreateGroupProductResDto extends BaseResDto {
  data?: GroupProductDto;
}

export class GetGroupProductsPaginatedReqDto implements PaginateQuery {
  page?: number;
  limit?: number;
  sortBy?: [string, string][];
  searchBy?: string[];
  search?: string;
  filter?: { [column: string]: string | string[] };
  select?: string[];
  path: string;

  @ApiProperty()
  groupId: string;
}

export class GetGroupProductsPaginatedResDto extends Paginated<GroupProductDto> {
  @ApiProperty()
  statusCode: number;

  @ApiProperty()
  message: string;
}
