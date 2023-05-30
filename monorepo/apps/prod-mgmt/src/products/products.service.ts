import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GetProductByBarcodeResDto } from 'libs/shared/src/lib/dto/prod-mgmt/products';
import { Repository } from 'typeorm';
import { ProductEntity } from '../entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepo: Repository<ProductEntity>,
  ) {}

  async getProductByBarcode(
    barcode: string,
  ): Promise<GetProductByBarcodeResDto> {
    const product = await this.productRepo.findOne({
      where: { barcode },
    });

    if (!product) {
      return {
        statusCode: 404,
        message: 'Product not found',
        data: null,
      };
    }

    return {
      statusCode: 200,
      message: 'Get product successfully',
      data: product,
    };
  }

  async createProduct(data: ProductEntity): Promise<ProductEntity> {
    // check if product already exists
    const product = await this.productRepo.findOne({
      where: { barcode: data.barcode },
    });

    if (product) {
      return product;
    }

    const newProduct = this.productRepo.create(data);

    await this.productRepo.save(newProduct);

    return {
      ...newProduct,
    };
  }
}
