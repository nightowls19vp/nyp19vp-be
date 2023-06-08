import {
  CreateGroupProductReqDto,
  CreateGroupProductResDto,
} from 'libs/shared/src/lib/dto/prod-mgmt/products';
import { Repository } from 'typeorm';

import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { GroupProductEntity } from '../entities/group-product.entity';
import { GroupEntity } from '../entities/group.entity';
import { ProductEntity } from '../entities/product.entity';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class GroupsProductsService {
  constructor(
    @InjectRepository(GroupEntity)
    private readonly groupRepo: Repository<GroupEntity>,

    @InjectRepository(ProductEntity)
    private readonly productRepo: Repository<ProductEntity>,

    @InjectRepository(GroupProductEntity)
    private readonly groupProductRepo: Repository<GroupProductEntity>,
  ) {}

  async createGroupProduct(
    reqDto: CreateGroupProductReqDto,
  ): Promise<CreateGroupProductResDto> {
    // find group
    const group = await this.groupRepo.findOne({
      where: { id: reqDto.groupId },
    });

    // if group not exist, return error
    if (!group) {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Group not found',
      };
    }

    // add groupProduct to group
    const groupProduct = this.groupProductRepo.create({
      group: group,
      ...reqDto,
      id: undefined,
    });

    try {
      await this.groupProductRepo.save(groupProduct);
    } catch (error) {
      throw new RpcException({
        statusCode: HttpStatus.CONFLICT,
        message: error.message || 'Create new group product failed',
        data: error?.data || undefined,
      });
    }

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Create new group product successfully',
      data: {
        id: groupProduct.id,
        barcode: groupProduct.barcode,
        brand: groupProduct.brand,
        category: groupProduct.category,
        description: groupProduct.description,
        image: groupProduct.image,
        name: groupProduct.name,
        price: groupProduct.price,
        region: groupProduct.region,
        timestamp: groupProduct.timestamp,
      },
    };
  }
}
