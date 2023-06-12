import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';

import { BaseResDto } from '../../base.dto';
import { PurchaseLocationDto } from '../dto/purchase-location.dto';
import { StorageLocationDto } from '../dto/storage-location.dto';
import { ProdMgmtGroupDto } from '../dto/group.dto';

export class CreatePurchaseLocationReqDto extends PurchaseLocationDto {
  @ApiProperty()
  groupId?: string;

  @ApiProperty({
    readOnly: true,
  })
  group?: ProdMgmtGroupDto;
}

export class CreatePurchaseLocationResDto extends BaseResDto {
  @ApiProperty({ readOnly: true, type: PurchaseLocationDto })
  data: PurchaseLocationDto;
}

export class GetPurchaseLocationResDto extends BaseResDto {
  @ApiProperty({ readOnly: true, type: PurchaseLocationDto })
  data: PurchaseLocationDto;
}

/* ----------- */

export class CreateStorageLocationReqDto extends PickType(
  PartialType(StorageLocationDto),
  ['name', 'addedBy', 'image', 'description'],
) {
  @ApiProperty()
  groupId?: string;

  @ApiProperty({
    readOnly: true,
  })
  group?: ProdMgmtGroupDto;
}

export class CreateStorageLocationResDto extends BaseResDto {
  data: StorageLocationDto;
}

export class GetStorageLocationResDto extends BaseResDto {
  data: StorageLocationDto;
}
