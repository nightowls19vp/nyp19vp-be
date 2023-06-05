import { ProdMgmtGroupDto } from './group.dto';
import { AddressEmbeddedDto } from './address.embedded.dto';
import { TimestampEmbeddedDto } from './timestamp.embedded.dto';
import { ItemDto } from './item.dto';
import { ApiProperty } from '@nestjs/swagger';

export class PurchaseLocationDto {
  @ApiProperty({ required: false })
  id?: string;

  @ApiProperty({ required: false })
  group?: ProdMgmtGroupDto;

  @ApiProperty({ required: false })
  name?: string;

  @ApiProperty({ required: false })
  addedBy?: string;

  @ApiProperty({ required: false })
  address?: AddressEmbeddedDto;

  @ApiProperty({ required: false })
  timestamp?: TimestampEmbeddedDto;

  @ApiProperty({ required: false })
  items?: ItemDto[];
}
