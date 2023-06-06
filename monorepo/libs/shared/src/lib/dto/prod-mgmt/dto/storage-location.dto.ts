import { ApiProperty } from '@nestjs/swagger';

import { ProdMgmtGroupDto } from './group.dto';
import { ItemDto } from './item.dto';
import { TimestampEmbeddedDto } from './timestamp.embedded.dto';

export class StorageLocationDto {
  @ApiProperty({ required: false })
  id?: string;

  @ApiProperty({ required: false })
  group?: ProdMgmtGroupDto;

  @ApiProperty({ required: false })
  name?: string;

  @ApiProperty({ required: false })
  addedBy?: string;

  @ApiProperty({ required: false })
  image?: string;

  @ApiProperty({ required: false })
  description?: string;

  // @ApiProperty({ required: false, type: [ItemDto], name: '__items__' })
  items?: ItemDto[];

  // @ApiProperty({ required: false })
  timestamp?: TimestampEmbeddedDto;
}
