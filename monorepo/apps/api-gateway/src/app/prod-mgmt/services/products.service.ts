import axios, { isAxiosError } from 'axios';
import * as cheerio from 'cheerio';

import { HttpStatus, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { BaseResDto, kafkaTopic } from '@nyp19vp-be/shared';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';
import {
  GetProductByBarcodeReqDto,
  GetProductByBarcodeResDto,
} from 'libs/shared/src/lib/dto/prod-mgmt/products';
import ms from 'ms';
import { ProductDto } from 'libs/shared/src/lib/dto/prod-mgmt/entities/product.entity';

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

  public async getProductByBarcode(barcode: string): Promise<BaseResDto> {
    //todo check barcode is inDb
    const retrieveRes = await this.getProductByBarcodeFromDb(barcode);

    console.log('retrieveRes', retrieveRes);

    if (retrieveRes.statusCode === HttpStatus.OK || retrieveRes.data) {
      return retrieveRes;
    }

    const fetchProduct = await this.getProductSuggestWithRetries(barcode);

    console.log('fetchProduct', fetchProduct);

    //todo save to db
    if (fetchProduct.statusCode === HttpStatus.OK && !retrieveRes.data) {
      const product = await this.createProduct({
        ...fetchProduct.data,
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'Product information fetched successfully',
        data: product,
      };
    }

    return fetchProduct;
  }

  private async getProductSuggestWithRetries(
    barcode: string,
    retries = 5,
  ): Promise<GetProductByBarcodeResDto> {
    const url = `https://go-upc.com/search?q=${barcode}`;

    try {
      const response = await axios.get(url);

      if (response.status !== HttpStatus.OK) {
        return {
          statusCode: response.status,
          message: response.statusText,
          data: null,
        };
      }

      const html = response.data;
      const $ = cheerio.load(html);

      const productName = $('.product-name').text().trim();
      const productImage = $('.product-image.mobile img').attr('src');
      const ean = $('td:contains("EAN")').next().text().trim();
      const region = ''; // Region is not available in the provided HTML
      const brand = $('td:contains("Brand")').next().text().trim();
      const category = $('td:contains("Category")').next().text().trim();
      const description = $('h2:contains("Description")')
        .next('span')
        .text()
        .trim();

      const productInfo: ProductDto = {
        id: undefined,
        barcode: ean,
        name: productName,
        image: productImage,
        brand: brand,
        category: category,
        description: description,
        price: undefined,
        region: region,
        groupProducts: undefined,
        timestamp: undefined,
      };

      if (!this.checkValidProductName(productName)) {
        throw new Error('Product error on fetch');
      }

      return {
        statusCode: HttpStatus.OK,
        message: 'Product information fetched successfully',
        data: Object.assign(productInfo),
      };
    } catch (error) {
      console.log('Error: ', error);

      if (isAxiosError(error)) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Product information fetch failed',
          data: null,
        };
      }

      if (retries === 0) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Product information fetch failed',
          data: null,
        };
      }

      return this.getProductSuggestWithRetries(barcode, retries - 1);
    }
  }

  private checkValidProductName(productName: string): boolean {
    return (
      productName !== '' &&
      productName.toLocaleLowerCase() !== 'product not found' &&
      !productName.toLocaleLowerCase().includes('loading')
    );
  }

  private async getProductByBarcodeFromDb(
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
