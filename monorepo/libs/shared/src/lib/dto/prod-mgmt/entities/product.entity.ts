import { TimestampEmbeddedEntity } from './timestamp.embedded.entity';
import { GroupProductDto } from './group-product.entity';

export class ProductDto {
  id: string;

  name: string;

  image: string;

  barcode: string;

  price: number;

  region: string;

  brand: string;

  category: string;

  description: string;

  groupProducts: Promise<GroupProductDto[]>;

  timestamp: TimestampEmbeddedEntity;
}
