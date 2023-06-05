import { PartialType, PickType } from '@nestjs/swagger';

import { BaseResDto } from '../../base.dto';
import { PurchaseLocationDto } from '../dto/purchase-location.dto';
import { StorageLocationDto } from '../dto/storage-location.dto';

export class CreatePurchaseLocationReqDto extends PurchaseLocationDto {}

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
  StorageLocationDto,
) {}

export class GetStorageLocationResDto extends BaseResDto {
  data: StorageLocationDto;
}
