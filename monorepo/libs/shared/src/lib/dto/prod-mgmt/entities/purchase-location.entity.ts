import { GroupDto_prod } from './group.entity';
import { AddressEmbeddedDto } from './address.embedded.entity';
import { TimestampEmbeddedEntity } from './timestamp.embedded.entity';
import { ItemDto } from './item.entity';
import { ApiProperty } from '@nestjs/swagger';

export class PurchaseLocationDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  group: GroupDto_prod;

  @ApiProperty()
  name: string;

  @ApiProperty()
  addedBy: string;

  @ApiProperty()
  items: Promise<ItemDto[]>;

  @ApiProperty()
  address: AddressEmbeddedDto;

  @ApiProperty()
  timestamp: TimestampEmbeddedEntity;
}
