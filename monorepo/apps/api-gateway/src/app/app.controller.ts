import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiQuery } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  @ApiQuery({
    name: 'barcode',
  })
  @Get('product-suggest')
  getProductSuggest(@Query('barcode') barcode: string) {
    return this.appService.getProductSuggestWithRetries(barcode);
  }
}
