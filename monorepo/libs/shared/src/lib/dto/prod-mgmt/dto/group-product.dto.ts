import { ApiProperty } from '@nestjs/swagger';

import { ProdMgmtItemDto } from './item.dto';
import { TimestampEmbeddedDto } from './timestamp.embedded.dto';

export class GroupProductDto {
  @ApiProperty({ required: false, readOnly: true })
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

  @ApiProperty({ type: TimestampEmbeddedDto, readOnly: true })
  timestamp?: TimestampEmbeddedDto;

  items?: ProdMgmtItemDto[];
}
