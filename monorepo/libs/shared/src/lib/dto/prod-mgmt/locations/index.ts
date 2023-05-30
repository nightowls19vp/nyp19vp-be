import { PartialType, PickType } from '@nestjs/swagger';

import { BaseResDto } from '../../base.dto';
import { PurchaseLocationDto } from '../entities/purchase-location.entity';
import { StorageLocationDto } from '../entities/storage-location.entity';

export class CreatePurchaseLocationReqDto extends PickType(
  PartialType(PurchaseLocationDto),
  ['name', 'addedBy', 'address', 'group'],
) {}

export class CreatePurchaseLocationResDto extends PartialType(
  PurchaseLocationDto,
) {}

export class GetPurchaseLocationResDto extends BaseResDto {
  data: PurchaseLocationDto;
}

/* ----------- */

export class CreateStorageLocationReqDto extends PickType(
  PartialType(StorageLocationDto),
  ['name', 'addedBy', 'image', 'description', 'group'],
) {}

export class CreateStorageLocationResDto extends PartialType(
  PurchaseLocationDto,
) {}

export class GetStorageLocationResDto extends BaseResDto {
  data: StorageLocationDto;
}
