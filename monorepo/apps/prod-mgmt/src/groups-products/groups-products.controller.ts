import {
  CreateGroupProductReqDto,
  DeleteGroupProductReqDto,
  GetGroupProductByIdReqDto,
  GetGroupProductsPaginatedReqDto,
  RestoreGroupProductReqDto,
} from 'libs/shared/src/lib/dto/prod-mgmt/products';

import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { kafkaTopic } from '@nyp19vp-be/shared';

import { GroupsProductsService } from './groups-products.service';

@Controller()
export class GroupsProductsController {
  constructor(private readonly groupsProductsService: GroupsProductsService) {}

  @MessagePattern(kafkaTopic.PROD_MGMT.groupProducts.create)
  createGroupProduct(@Payload() reqDto: CreateGroupProductReqDto) {
    console.log('#kafkaTopic.PROD_MGMT.groupProducts.create', reqDto);

    return this.groupsProductsService.createGroupProduct(reqDto);
  }

  @MessagePattern(kafkaTopic.PROD_MGMT.groupProducts.getById)
  getGroupProductById(@Payload() data: GetGroupProductByIdReqDto) {
    console.log('#kafkaTopic.PROD_MGMT.groupProducts.getById', data);

    return this.groupsProductsService.getGroupProductById(data);
  }

  @MessagePattern(kafkaTopic.PROD_MGMT.groupProducts.getPaginated)
  getGroupProductsPaginated(@Payload() data: GetGroupProductsPaginatedReqDto) {
    console.log('#kafkaTopic.PROD_MGMT.groupProducts.getPaginated', data);

    return this.groupsProductsService.getGroupProductsPaginated(data);
  }

  @MessagePattern(kafkaTopic.PROD_MGMT.groupProducts.delete)
  deleteGroupProduct(@Payload() data: DeleteGroupProductReqDto) {
    console.log('#kafkaTopic.PROD_MGMT.groupProducts.delete', data);

    return this.groupsProductsService.deleteGroupProduct(data);
  }

  @MessagePattern(kafkaTopic.PROD_MGMT.groupProducts.restore)
  restoreGroupProduct(@Payload() data: RestoreGroupProductReqDto) {
    console.log('#kafkaTopic.PROD_MGMT.groupProducts.restore', data);

    return this.groupsProductsService.restoreGroupProduct(data);
  }

  @MessagePattern(kafkaTopic.PROD_MGMT.groupProducts.update)
  updateGroupProduct(@Payload() reqDto: CreateGroupProductReqDto) {
    console.log('#kafkaTopic.PROD_MGMT.groupProducts.update', reqDto);

    return this.groupsProductsService.updateGroupProduct(reqDto);
  }
}
