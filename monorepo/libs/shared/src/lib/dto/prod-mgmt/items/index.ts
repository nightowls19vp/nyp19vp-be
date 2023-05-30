import { GroupProductDto } from '../entities/group-product.entity';
import { ItemDto } from '../entities/item.entity';
import { ProductDto } from '../entities/product.entity';

export class AddItemReqDto {
  groupMongoId: string;

  productId: string;

  groupProduct: GroupProductDto;

  item: ItemDto;
}
