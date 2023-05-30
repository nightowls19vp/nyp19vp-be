import { BaseResDto } from '../../base.dto';
import { ProductDto } from '../entities/product.entity';

export class GetProductByBarcodeReqDto {
  barcode: string;
}

export class GetProductByBarcodeResDto extends BaseResDto {
  data: ProductDto;
}
