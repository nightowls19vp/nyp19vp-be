import { ApiProperty } from '@nestjs/swagger';

import { ItemDto } from './item.dto';
import { TimestampEmbeddedDto } from './timestamp.embedded.dto';

export class GroupProductDto {
  @ApiProperty({ required: false })
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

  // @ApiProperty({ type: () => [GroupProductDto] })
  groupProducts?: GroupProductDto[];

  // @ApiProperty({ type: () => TimestampEmbeddedDto })
  timestamp?: TimestampEmbeddedDto;

  // @ApiProperty({ required: false })
  items?: ItemDto[];
}
