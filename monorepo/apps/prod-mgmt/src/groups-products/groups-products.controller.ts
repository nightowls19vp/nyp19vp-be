import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { GroupsProductsService } from './groups-products.service';
import { kafkaTopic } from '@nyp19vp-be/shared';
import { CreateGroupProductReqDto } from 'libs/shared/src/lib/dto/prod-mgmt/products';

@Controller()
export class GroupsProductsController {
  constructor(private readonly groupsProductsService: GroupsProductsService) {}

  @MessagePattern(kafkaTopic.PROD_MGMT.groupProducts.create)
  createGroupProduct(@Payload() reqDto: CreateGroupProductReqDto) {
    console.log('#kafkaTopic.PROD_MGMT.groupProducts.create', reqDto);

    return this.groupsProductsService.createGroupProduct(reqDto);
  }
}
