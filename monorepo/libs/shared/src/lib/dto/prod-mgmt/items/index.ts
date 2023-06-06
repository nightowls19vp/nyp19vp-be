import { GroupProductDto } from '../dto/group-product.dto';
import { ItemDto } from '../dto/item.dto';
import { ProductDto } from '../dto/product.dto';

export class AddItemReqDto {
  groupMongoId: string;

  productId: string;

  groupProduct: GroupProductDto;

  item: ItemDto;
}
