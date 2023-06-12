import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';

import { ProductDto } from './dto/product.dto';
import { ProductsService } from './products/products.service';

@ApiTags('route: prod-mgmt')
@Controller('prod-mgmt')
export class ProdMgmtController {
  constructor(private readonly productService: ProductsService) {}

  @ApiOkResponse({
    type: ProductDto,
  })
  @ApiQuery({
    name: 'barcode',
    required: true,
    description: 'Barcode of the product',
    example: '8935049004226',
  })
  @Get('product-by-barcode')
  getProductByBarcode(@Query('barcode') barcode: string) {
    return this.productService.getProductByBarcode(barcode);
  }
}
