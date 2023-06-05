import { ApiProperty } from '@nestjs/swagger';

import { ProdMgmtGroupDto } from './group.dto';
import { ItemDto } from './item.dto';
import { ProductDto } from './product.dto';
import { TimestampEmbeddedDto } from './timestamp.embedded.dto';

export class GroupProductDto extends ProductDto {
  @ApiProperty({ required: false })
  id?: string;

  @ApiProperty({ required: false })
  group?: ProdMgmtGroupDto;

  @ApiProperty({ required: false })
  product?: ProductDto;

  @ApiProperty({ required: false })
  customName?: string;

  @ApiProperty({ required: false })
  customImage?: string;

  @ApiProperty({ required: false })
  customPrice?: number;

  @ApiProperty({ required: false })
  customDescription?: string;

  @ApiProperty({ required: false })
  timestamp?: TimestampEmbeddedDto;

  @ApiProperty({ required: false })
  items?: Promise<ItemDto[]>;
}
