import {
  filteredColumns,
  searchableColumns,
  sortableColumns,
} from 'libs/shared/src/lib/config/prod-mgmt';
import { GroupProductDto } from 'libs/shared/src/lib/dto/prod-mgmt/dto/group-product.dto';
import {
  CreateGroupProductReqDto,
  CreateGroupProductResDto,
  GetGroupProductsPaginatedResDto,
} from 'libs/shared/src/lib/dto/prod-mgmt/products';
import { Paginate, PaginateQuery } from 'nestjs-paginate';

import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { PaginateQueryOptions } from '@nyp19vp-be/shared';

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

  @ApiOperation({
    summary: 'Get group products',
    description: 'Get group products',
  })
  @PaginateQueryOptions(
    GroupProductDto,
    searchableColumns,
    sortableColumns,
    filteredColumns,
  )
  @Get(':groupId')
  getGroupProducts(
    @Paginate() query: PaginateQuery,
    @Param('groupId') groupId: string,
  ): Promise<GetGroupProductsPaginatedResDto> {
    return this.groupProductsService.getGroupProductsPaginated(query, groupId);
  }
}
