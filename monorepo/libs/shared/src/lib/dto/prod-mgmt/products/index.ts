import { BaseResDto } from '../../base.dto';
import { ProductDto } from '../dto/product.dto';

export class GetProductByBarcodeReqDto {
  barcode: string;
}

export class GetProductByBarcodeResDto extends BaseResDto {
  data: ProductDto;
}

export * from './group-product';
