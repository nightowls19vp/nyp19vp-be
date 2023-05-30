import { GroupDto_prod } from './group.entity';
import { TimestampEmbeddedEntity } from './timestamp.embedded.entity';
import { ItemDto } from './item.entity';

export class StorageLocationDto {
  id: string;

  group: GroupDto_prod;

  name: string;

  addedBy: string;

  image: string;

  description: string;

  items: Promise<ItemDto[]>;

  timestamp: TimestampEmbeddedEntity;
}
