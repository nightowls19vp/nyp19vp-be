import { GroupDto_prod } from './group.entity';
import { ProductDto } from './product.entity';
import { TimestampEmbeddedEntity } from './timestamp.embedded.entity';
import { ItemDto } from './item.entity';

export class GroupProductDto {
  id: string;

  group: GroupDto_prod;

  product: ProductDto;

  customName: string;

  customImage: string;

  customPrice: number;

  customDescription: string;

  timestamp: TimestampEmbeddedEntity;

  items: Promise<ItemDto[]>;
}
