import { ProductDto } from 'libs/shared/src/lib/dto/prod-mgmt/dto/product.dto';
import {
  GetProductByBarcodeReqDto,
  GetProductByBarcodeResDto,
} from 'libs/shared/src/lib/dto/prod-mgmt/products';
import ms from 'ms';
import { firstValueFrom, timeout } from 'rxjs';

import { HttpStatus, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { kafkaTopic } from '@nyp19vp-be/shared';

@Injectable()
export class ProductService implements OnModuleInit {
  constructor(
    @Inject('PROD_MGMT_SERVICE')
    private readonly prodMgmtClient: ClientKafka,
  ) {}
  onModuleInit() {
    this.prodMgmtClient.subscribeToResponseOf(
      kafkaTopic.PROD_MGMT.get_product_by_barcode,
    );
    this.prodMgmtClient.subscribeToResponseOf(
      kafkaTopic.PROD_MGMT.create_product,
    );
  }

  public async getProductByBarcode(
    barcode: string,
  ): Promise<GetProductByBarcodeResDto> {
    try {
      const payload: GetProductByBarcodeReqDto = {
        barcode,
      };

      console.log('payload', payload);

      const response = await firstValueFrom(
        this.prodMgmtClient
          .send(
            kafkaTopic.PROD_MGMT.get_product_by_barcode,
            JSON.stringify(payload),
          )
          .pipe(timeout(ms('5s'))),
      );

      console.log('response', response);
      return response;
    } catch (error) {
      console.log('Error: ', error);

      return {
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Product information fetch failed',
        data: null,
      };
    }
  }

  private async createProduct(product: ProductDto): Promise<ProductDto> {
    console.log('createProduct', product);

    const payload: ProductDto = {
      ...product,
    };

    const response = await firstValueFrom(
      this.prodMgmtClient
        .send(kafkaTopic.PROD_MGMT.create_product, JSON.stringify(payload))
        .pipe(timeout(ms('5s'))),
    );

    console.log('response', response);

    return response;
  }
}
