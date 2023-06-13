import {
  filteredColumns,
  searchableColumns,
  sortableColumns,
} from 'libs/shared/src/lib/config/prod-mgmt';
import { GroupProductDto } from 'libs/shared/src/lib/dto/prod-mgmt/dto/group-product.dto';
import {
  CreateGroupProductReqDto,
  CreateGroupProductResDto,
  DeleteGroupProductResDto,
  GetGroupProductByIdResDto,
  GetGroupProductsPaginatedResDto,
  RestoreGroupProductResDto,
  UpdateGroupProductReqDto,
  UpdateGroupProductResDto,
} from 'libs/shared/src/lib/dto/prod-mgmt/products';
import { Paginate, PaginateQuery } from 'nestjs-paginate';

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { PaginateQueryOptions } from '@nyp19vp-be/shared';

import { GroupProductsService } from './group-products.service';

@ApiTags('route: prod-mgmt', 'route: prod-mgmt/group-products')
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
    summary: 'Get group product by id',
    description: 'Get group product by id',
  })
  @ApiOkResponse({
    description: 'Get group product by id',
    type: GetGroupProductByIdResDto,
  })
  @ApiNotFoundResponse({
    description:
      'Group product not found. Reason: The group product id does not exist',
  })
  @ApiInternalServerErrorResponse({
    description: `Internal server error when get group product by id. Reason:
    - Timeout when connect to database
    - Timeout when connect to kafka microservice`,
  })
  @ApiParam({
    name: 'groupId',
    description: 'The group id',
    type: String,
  })
  @ApiParam({
    name: 'id',
    description: 'The group product id',
    type: String,
  })
  @Get(':groupId/:id')
  getGroupProductById(
    @Param('groupId') groupId: string,
    @Param('id') id: string,
  ) {
    return this.groupProductsService.getGroupProductById(groupId, id);
  }

  @ApiOperation({
    summary: 'Get PAGINATED group products',
    description: 'Get PAGINATED group products',
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

  @ApiOperation({
    summary: 'Delete group product by id',
    description: 'Delete group product by id',
  })
  @ApiOkResponse({
    description: 'Delete group product by id',
    type: DeleteGroupProductResDto,
  })
  @ApiNotFoundResponse({
    description:
      'Group product not found. Reason: The group product id does not exist',
  })
  @ApiInternalServerErrorResponse({
    description: `Internal server error when delete group product by id. Reason:
    - Timeout when connect to database
    - Timeout when connect to kafka microservice`,
  })
  @ApiParam({
    name: 'groupId',
    description: 'The id of the group',
    type: String,
  })
  @ApiParam({
    name: 'id',
    description: 'The id of the group product',
    type: String,
  })
  @Delete(':groupId/:id')
  deleteGroupProduct(
    @Param('groupId') groupId: string,
    @Param('id') id: string,
  ) {
    return this.groupProductsService.deleteGroupProduct(groupId, id);
  }

  @ApiOperation({
    summary: 'Restore group product by id',
    description: 'Restore group product by id',
  })
  @ApiOkResponse({
    description: 'Restore group product by id',
    type: RestoreGroupProductResDto,
  })
  @ApiNotFoundResponse({
    description:
      'Group product not found. Reason: The group product id does not exist',
  })
  @ApiInternalServerErrorResponse({
    description: `Internal server error when restore group product by id. Reason:
    - Timeout when connect to database
    - Timeout when connect to kafka microservice`,
  })
  @ApiParam({
    name: 'groupId',
    description: 'The id of the group',
    type: String,
  })
  @ApiParam({
    name: 'id',
    description: 'The id of the group product',
    type: String,
  })
  @Post(':groupId/:id/restore')
  restoreGroupProduct(
    @Param('groupId') groupId: string,
    @Param('id') id: string,
  ) {
    return this.groupProductsService.restoreGroupProduct(groupId, id);
  }

  @ApiOperation({
    summary: 'Update group product by id',
    description: 'Update group product by id',
  })
  @ApiOkResponse({
    description: 'Update group product by id',
    type: UpdateGroupProductResDto,
  })
  @ApiNotFoundResponse({
    description:
      'Group product not found. Reason: The group product id does not exist',
  })
  @ApiInternalServerErrorResponse({
    description: `Internal server error when update group product by id. Reason:
    - Timeout when connect to database
    - Timeout when connect to kafka microservice`,
  })
  @ApiParam({
    name: 'groupId',
    description: 'The id of the group',
    type: String,
  })
  @ApiParam({
    name: 'id',
    description: 'The id of the group product',
    type: String,
  })
  @Put(':groupId/:id')
  updateGroupProduct(
    @Param('groupId') groupId: string,
    @Param('id') id: string,
    @Body() reqDto: UpdateGroupProductReqDto,
  ) {
    return this.groupProductsService.updateGroupProduct(groupId, id, reqDto);
  }
}
