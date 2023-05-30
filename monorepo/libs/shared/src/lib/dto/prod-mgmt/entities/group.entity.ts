import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

import { GroupProductDto } from './group-product.entity';
import { PurchaseLocationDto } from './purchase-location.entity';
import { StorageLocationDto } from './storage-location.entity';
import { TimestampEmbeddedEntity } from './timestamp.embedded.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({
  name: 'groups',
})
export class GroupDto_prod {
  @ApiProperty()
  id: string;

  @ApiProperty()
  groupMongoId: string;

  @ApiProperty()
  groupProducts: Promise<GroupProductDto[]>;

  @ApiProperty()
  purchaseLocations: Promise<PurchaseLocationDto[]>;

  @ApiProperty()
  storageLocations: Promise<StorageLocationDto[]>;

  @ApiProperty()
  timestamp: TimestampEmbeddedEntity;
}
