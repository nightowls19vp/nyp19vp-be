import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseResDto } from '@nyp19vp-be/shared';
import { GroupProductDto } from 'libs/shared/src/lib/dto/prod-mgmt/dto/group-product.dto';
import { In, Repository } from 'typeorm';
import { GroupProductEntity } from '../entities/group-product.entity';
import { ProductEntity } from '../entities/product.entity';
import { CreateGroupProductReqDto } from 'libs/shared/src/lib/dto/prod-mgmt/products';
import { fetchProductDataFromGoUpc } from '../utils/go-upc';
import { ProductDto } from 'libs/shared/src/lib/dto/prod-mgmt/dto/product.dto';

@Injectable()
export class GroupsProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepo: Repository<ProductEntity>,

    @InjectRepository(GroupProductEntity)
    private readonly groupProductRepo: Repository<GroupProductEntity>,
  ) {}

  async createGroupProduct(
    reqDto: CreateGroupProductReqDto,
  ): Promise<BaseResDto> {
    // find there is any `product` exist with the same `barcode` in db with `reqDto.barcode`

    let product = await this.productRepo.findOne({
      where: { barcode: reqDto.barcode },
    });

    // if there is no product exist with the same barcode in db, try to find the product from `go-upc` api
    if (!product) {
      const productDto: ProductDto = await fetchProductDataFromGoUpc(
        reqDto.barcode,
      );

      // if exist in `go-upc` api, create a new product in db
      if (productDto) {
        product = await this.productRepo.save(productDto);
      } else {
        // this `group-product` is not linked to any product
        // const groupProduc;
      }
    }

    return null;
  }
}
