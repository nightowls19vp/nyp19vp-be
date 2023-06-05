import { ApiProperty } from '@nestjs/swagger';

import { GroupProductDto } from './group-product.dto';
import { TimestampEmbeddedDto } from './timestamp.embedded.dto';

export class ProductDto {
  @ApiProperty()
  id?: string;

  @ApiProperty()
  name?: string;

  @ApiProperty()
  image?: string;

  @ApiProperty()
  barcode?: string;

  @ApiProperty()
  price?: number;

  @ApiProperty()
  region?: string;

  @ApiProperty()
  brand?: string;

  @ApiProperty()
  category?: string;

  @ApiProperty()
  description?: string;

  @ApiProperty({ type: () => [GroupProductDto] })
  groupProducts?: Promise<GroupProductDto[]>;

  @ApiProperty({ type: () => TimestampEmbeddedDto })
  timestamp?: TimestampEmbeddedDto;
}
