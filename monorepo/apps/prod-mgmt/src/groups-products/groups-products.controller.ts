import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { GroupsProductsService } from './groups-products.service';

@Controller()
export class GroupsProductsController {
  constructor(private readonly groupsProductsService: GroupsProductsService) {}

  
}
