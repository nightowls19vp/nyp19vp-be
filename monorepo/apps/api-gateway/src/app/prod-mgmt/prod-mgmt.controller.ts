import { CreatePurchaseLocationReqDto } from 'libs/shared/src/lib/dto/prod-mgmt/locations';

import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';

import { ProductDto } from './dto/product.dto';
import { LocationService } from './services/location.service';
import { ProdMgmtService } from './services/prod-mgmt.service';
import { ProductService } from './services/products.service';

@ApiTags('route: prod-mgmt')
@Controller('prod-mgmt')
export class ProdMgmtController {
  constructor(
    private readonly prodMgmtService: ProdMgmtService,

    private readonly productService: ProductService,

    private readonly locationService: LocationService,
  ) {}

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

  @Post('purchase-location')
  createPurchaseLocation(@Body() data: CreatePurchaseLocationReqDto) {
    return this.locationService.createPurchaseLocation(data);
  }

  @Post('storage-location')
  createStorageLocation(@Body() data: CreatePurchaseLocationReqDto) {
    return this.locationService.createStorageLocation(data);
  }
}
