import {
  itemsFilterableColumns,
  itemsSearchableColumns,
  itemsSortableColumns,
} from 'libs/shared/src/lib/config';
import {
  CreateItemReqDto,
  CreateItemResDto,
  DeleteItemResDto,
  GetItemByIdResDto,
  GetItemsPaginatedResDto,
  RestoreItemResDto,
} from 'libs/shared/src/lib/dto/prod-mgmt/items';
import { Paginate, PaginateQuery } from 'nestjs-paginate';

import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { ItemDto, PaginateQueryOptions } from '@nyp19vp-be/shared';

import { ItemsService } from './items.service';

@ApiTags('route: prod-mgmt', 'route: prod-mgmt/items')
@Controller('prod-mgmt/items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @ApiOperation({
    summary: 'Create item',
    description: 'Create item',
  })
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: CreateItemResDto,
  })
  @ApiBadRequestResponse({
    description: 'Bad request when create item.',
  })
  @Post()
  createItem(@Body() data: CreateItemReqDto) {
    return this.itemsService.createItem(data);
  }

  @ApiOperation({
    summary: 'Get item by id',
    description: 'Get item by id',
  })
  @ApiOkResponse({
    description: 'Get item by id',
    type: GetItemByIdResDto,
  })
  @ApiBadRequestResponse({
    description: `Bad request when get item by id. Reason:
    - Invalid item id`,
  })
  @ApiNotFoundResponse({
    description: 'Item not found. Reason: The item id does not exist',
  })
  @ApiInternalServerErrorResponse({
    description: `Internal server error when get item by id. Reason:
    - Timeout when connect to database
    - Timeout when connect to kafka microservice`,
  })
  @ApiParam({
    name: 'id',
    description: 'The item id',
    type: String,
  })
  @Get(':id')
  getItemById(@Param('id') id: string) {
    return this.itemsService.getItemById(id);
  }

  @ApiOperation({
    summary: 'Get **PAGINATED** items',
    description: 'Get **PAGINATED** items',
  })
  @PaginateQueryOptions(
    ItemDto,
    itemsSearchableColumns,
    itemsSortableColumns,
    itemsFilterableColumns,
  )
  @Get()
  getItems(@Paginate() query: PaginateQuery): Promise<GetItemsPaginatedResDto> {
    return this.itemsService.getItemsPaginated(query);
  }

  @ApiOperation({
    summary: 'Delete item by id',
    description: 'Delete item by id',
  })
  @ApiOkResponse({
    description: 'Delete item by id',
    type: DeleteItemResDto,
  })
  @ApiBadRequestResponse({
    description: `Bad request when get item by id. Reason:
    - Invalid item id`,
  })
  @ApiNotFoundResponse({
    description: 'Item not found. Reason: The item id does not exist',
  })
  @ApiInternalServerErrorResponse({
    description: `Internal server error when delete item by id. Reason:
    - Timeout when connect to database
    - Timeout when connect to kafka microservice`,
  })
  @ApiParam({
    name: 'id',
    description: 'The item id',
    type: String,
  })
  @Delete(':id')
  deleteItem(@Param('id') id: string) {
    return this.itemsService.deleteItem(id);
  }

  @ApiOperation({
    summary: 'Restore item by id',
    description: 'Restore item by id',
  })
  @ApiOkResponse({
    description: 'Restore item by id',
    type: RestoreItemResDto,
  })
  @ApiBadRequestResponse({
    description: `Bad request when get item by id. Reason:
    - Invalid item id`,
  })
  @ApiNotFoundResponse({
    description: 'Item not found. Reason: The item id does not exist',
  })
  @ApiInternalServerErrorResponse({
    description: `Internal server error when restore item by id. Reason:
    - Timeout when connect to database
    - Timeout when connect to kafka microservice`,
  })
  @ApiParam({
    name: 'id',
    description: 'The item id',
    type: String,
  })
  @Post(':id/restore')
  restoreItem(@Param('id') id: string) {
    return this.itemsService.restoreItem(id);
  }
}
