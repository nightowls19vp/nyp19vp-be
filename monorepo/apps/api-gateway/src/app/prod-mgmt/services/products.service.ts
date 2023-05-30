import axios, { Axios, isAxiosError } from 'axios';
import * as cheerio from 'cheerio';

import { HttpStatus, Injectable } from '@nestjs/common';
import { BaseResDto } from '@nyp19vp-be/shared';
import { IProduct } from '../interfaces/product.interface';

@Injectable()
export class ProductService {
  public getProductByBarcode(barcode: string): Promise<BaseResDto> {
    return this.getProductSuggestWithRetries(barcode);
  }

  private async getProductSuggestWithRetries(
    barcode: string,
    retries = 5,
  ): Promise<BaseResDto> {
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
      const additionalAttributes: { [key: string]: string } = {};
      $('.metadata-label').each((_, element) => {
        const label = $(element).text().trim();
        const value = $(element).next().text().trim();
        additionalAttributes[label] = value;
      });

      const productInfo: IProduct = {
        name: productName,
        image: productImage,
        barcode: ean,
        region,
        brand,
        category,
        description,
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
}
