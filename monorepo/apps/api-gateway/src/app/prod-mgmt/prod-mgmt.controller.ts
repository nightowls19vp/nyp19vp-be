import { CreatePurchaseLocationReqDto } from 'libs/shared/src/lib/dto/prod-mgmt/locations';

import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';

import { ProductDto } from './dto/product.dto';
import { LocationsService } from './locations/locations.service';
import { ProdMgmtService } from './prod-mgmt.service';
import { ProductsService } from './products/products.service';

@ApiTags('route: prod-mgmt')
@Controller('prod-mgmt')
export class ProdMgmtController {
  constructor(
    private readonly prodMgmtService: ProdMgmtService,

    private readonly productService: ProductsService,

    private readonly locationService: LocationsService,
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
