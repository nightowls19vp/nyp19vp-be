import { HttpStatus, Injectable } from '@nestjs/common';
import { BaseResDto } from '@nyp19vp-be/shared';

import axios from 'axios';
import * as cheerio from 'cheerio';

interface ProductInfo {
  productName: string;
  productImage: string;
  ean: string;
  region: string;
  brand: string;
  category: string;
  description: string;
}

@Injectable()
export class AppService {
  getData(): { message: string } {
    return { message: 'Welcome to api-gateway!' };
  }

  async getProductSuggestWithRetries(
    barcode: string,
    retries = 5,
  ): Promise<BaseResDto> {
    const url = `https://go-upc.com/search?q=${barcode}`;

    try {
      const response = await axios.get(url);
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

      const productInfo: ProductInfo = {
        productName,
        productImage,
        ean,
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
      if (retries === 0) {
        return {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Product information fetch failed',
          data: error,
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
