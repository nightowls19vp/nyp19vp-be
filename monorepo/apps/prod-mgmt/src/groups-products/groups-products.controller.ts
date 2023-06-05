import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { GroupsProductsService } from './groups-products.service';
import { kafkaTopic } from '@nyp19vp-be/shared';
import { CreateGroupProductReqDto } from 'libs/shared/src/lib/dto/prod-mgmt/products';

@Controller()
export class GroupsProductsController {
  constructor(private readonly groupsProductsService: GroupsProductsService) {}

  @MessagePattern(kafkaTopic.PROD_MGMT.create_group_product)
  createGroupProduct(@Payload() reqDto: CreateGroupProductReqDto) {
    return this.groupsProductsService.createGroupProduct(reqDto);
  }
}
