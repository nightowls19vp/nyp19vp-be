import {
  CreateGroupProductReqDto,
  CreateGroupProductResDto,
} from 'libs/shared/src/lib/dto/prod-mgmt/products';

import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { GroupProductsService } from './group-products.service';

@ApiTags('route: prod-mgmt')
@Controller('prod-mgmt/group-products')
export class GroupProductsController {
  constructor(private readonly groupProductsService: GroupProductsService) {}

  @ApiOperation({
    summary: 'Create group product',
    description: 'Create group product',
  })
  @ApiCreatedResponse({
    description: 'Create group product',
    type: CreateGroupProductResDto,
  })
  @ApiNotFoundResponse({
    description: 'Group not found',
  })
  @ApiInternalServerErrorResponse({
    description: `Internal server error when create group product. Reason:
    - Duplicate barcode
    - Timeout when connect to database
    - Timeout when connect to kafka microservice`,
  })
  @Post()
  createGroupProduct(@Body() reqDto: CreateGroupProductReqDto) {
    return this.groupProductsService.createGroupProduct(reqDto);
  }
}
