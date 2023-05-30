import { GroupProductDto } from './group-product.entity';
import { PurchaseLocationDto } from './purchase-location.entity';
import { StorageLocationDto } from './storage-location.entity';
import { TimestampEmbeddedEntity } from './timestamp.embedded.entity';

export class ItemDto {
  id: string;

  groupProduct: GroupProductDto;

  purchaseLocation: PurchaseLocationDto;

  storageLocation: StorageLocationDto;

  addedBy: string;

  bestBefore: Date;

  quantity: number;

  unit: string;

  image: string;

  timestamp: TimestampEmbeddedEntity;
}
