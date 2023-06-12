import { ProdMgmtGroupDto } from './group.dto';
import { AddressEmbeddedDto } from './address.embedded.dto';
import { TimestampEmbeddedDto } from './timestamp.embedded.dto';
import { ItemDto } from './item.dto';
import { ApiProperty } from '@nestjs/swagger';

export class PurchaseLocationDto {
  @ApiProperty({ required: false, readOnly: true })
  id?: string;

  @ApiProperty({
    required: false,
    readOnly: true,
    type: ProdMgmtGroupDto,
  })
  group?: ProdMgmtGroupDto;

  @ApiProperty({ required: false })
  name?: string;

  @ApiProperty({ required: false })
  addedBy?: string;

  @ApiProperty({ required: false })
  address?: AddressEmbeddedDto;

  @ApiProperty({ required: false, type: TimestampEmbeddedDto, readOnly: true })
  timestamp?: TimestampEmbeddedDto;

  items?: ItemDto[];
}
