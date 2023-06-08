import { Entity } from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';

import { GroupProductDto } from './group-product.dto';
import { PurchaseLocationDto } from './purchase-location.dto';
import { StorageLocationDto } from './storage-location.dto';
import { TimestampEmbeddedDto } from './timestamp.embedded.dto';

@Entity({
  name: 'groups',
})
export class ProdMgmtGroupDto {
  @ApiProperty({ required: false })
  id?: string;

  // @ApiProperty({
  //   required: false,
  //   type: [GroupProductDto],
  //   name: '__groupProducts__',
  // })
  groupProducts?: GroupProductDto[];

  // @ApiProperty({
  //   required: false,
  //   type: [PurchaseLocationDto],
  //   name: '__purchaseLocations__',
  // })
  purchaseLocations?: PurchaseLocationDto[];

  // @ApiProperty({
  //   required: false,
  //   type: [StorageLocationDto],
  //   name: '__storageLocations__',
  // })
  storageLocations?: StorageLocationDto[];

  // @ApiProperty({ required: false })
  timestamp?: TimestampEmbeddedDto;
}
