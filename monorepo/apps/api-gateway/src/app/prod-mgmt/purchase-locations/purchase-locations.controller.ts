import {
  purchaseLocationsFilterableColumns,
  purchaseLocationsSearchableColumns,
  purchaseLocationsSortableColumns,
} from 'libs/shared/src/lib/config';
import { PurchaseLocationDto } from 'libs/shared/src/lib/dto/prod-mgmt/dto/purchase-location.dto';
import {
  CreatePurchaseLocationReqDto,
  CreatePurchaseLocationResDto,
  DeletePurchaseLocationResDto,
  GetPurchaseLocationByIdResDto,
  GetPurchaseLocationsPaginatedResDto,
  RestorePurchaseLocationResDto,
  UpdatePurchaseLocationReqDto,
  UpdatePurchaseLocationResDto,
} from 'libs/shared/src/lib/dto/prod-mgmt/locations';
import { Paginate, PaginateQuery } from 'nestjs-paginate';

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
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
import { PaginateQueryOptions } from '@nyp19vp-be/shared';

import { PurchaseLocationsService } from './purchase-locations.service';

@ApiTags('route: prod-mgmt', 'route: prod-mgmt/purchase-locations')
@Controller('prod-mgmt/purchase-locations')
export class PurchaseLocationsController {
  constructor(
    private readonly purchaseLocationsService: PurchaseLocationsService,
  ) {}

  @ApiOperation({
    summary: 'Create purchase location',
    description: 'Create purchase location',
  })
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: CreatePurchaseLocationResDto,
  })
  @ApiBadRequestResponse({
    description: 'Bad request when create purchase location.',
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
  async createPurchaseLocation(
    @Body() reqDto: CreatePurchaseLocationReqDto,
  ): Promise<CreatePurchaseLocationResDto> {
    return this.purchaseLocationsService.createPurchaseLocation(reqDto);
  }

  @ApiOperation({
    summary: 'Get purchase location by id',
    description: 'Get purchase location by id',
  })
  @ApiOkResponse({
    description: 'Get purchase location by id',
    type: GetPurchaseLocationByIdResDto,
  })
  @ApiBadRequestResponse({
    description: `Bad request when get purchase location by id. Reason:
    - Invalid purchase location id`,
  })
  @ApiNotFoundResponse({
    description:
      'Group product not found. Reason: The group product id does not exist',
  })
  @ApiInternalServerErrorResponse({
    description: `Internal server error when get purchase location by id. Reason:
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
  async getPurchaseLocationById(
    @Param('groupId') groupId: string,
    @Param('id') id: string,
  ): Promise<GetPurchaseLocationByIdResDto> {
    return this.purchaseLocationsService.getPurchaseLocationById(groupId, id);
  }

  @ApiOperation({
    summary: 'Get **PAGINATED** purchase locations',
    description: 'Get **PAGINATED** purchase locations',
  })
  @PaginateQueryOptions(
    PurchaseLocationDto,
    purchaseLocationsSearchableColumns,
    purchaseLocationsSortableColumns,
    purchaseLocationsFilterableColumns,
  )
  @Get('/:groupId')
  async getPurchaseLocationsPaginated(
    @Paginate() query: PaginateQuery,
    @Param('groupId') groupId: string,
  ): Promise<GetPurchaseLocationsPaginatedResDto> {
    return this.purchaseLocationsService.getPurchaseLocationsPaginated(
      query,
      groupId,
    );
  }

  @ApiOperation({
    summary: 'Delete purchase location by id',
    description: 'Delete purchase location by id',
  })
  @ApiOkResponse({
    description: 'Delete purchase location by id',
    type: DeletePurchaseLocationResDto,
  })
  @ApiBadRequestResponse({
    description: `Bad request when delete purchase location by id. Reason:
    - Invalid purchase location id,
    - Invalid group id`,
  })
  @ApiNotFoundResponse({
    description:
      'Purchase location not found. Reason: The purchase location id does not exist',
  })
  @ApiInternalServerErrorResponse({
    description: `Internal server error when delete purchase location by id. Reason:
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
    description: 'The purchase location id',
    type: String,
  })
  @Delete('/:groupId/:id')
  async deletePurchaseLocation(
    @Param('groupId') groupId: string,
    @Param('id') id: string,
  ): Promise<DeletePurchaseLocationResDto> {
    return this.purchaseLocationsService.deletePurchaseLocation(groupId, id);
  }

  @ApiOperation({
    summary: 'Restore purchase location by id',
    description: 'Restore purchase location by id',
  })
  @ApiOkResponse({
    description: 'Restore purchase location by id',
    type: RestorePurchaseLocationResDto,
  })
  @ApiBadRequestResponse({
    description: `Bad request when restore purchase location by id. Reason:
    - Invalid purchase location id,
    - Invalid group id`,
  })
  @ApiNotFoundResponse({
    description:
      'Purchase location not found. Reason: The purchase location id does not exist',
  })
  @ApiInternalServerErrorResponse({
    description: `Internal server error when restore purchase location by id. Reason:
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
    description: 'The purchase location id',
    type: String,
  })
  @Patch('/:groupId/:id')
  async restorePurchaseLocation(
    @Param('groupId') groupId: string,
    @Param('id') id: string,
  ): Promise<RestorePurchaseLocationResDto> {
    return this.purchaseLocationsService.restorePurchaseLocation(groupId, id);
  }

  @ApiOperation({
    summary: 'Update purchase location by id',
    description: 'Update purchase location by id',
  })
  @ApiOkResponse({
    description: 'Update purchase location by id',
    type: UpdatePurchaseLocationResDto,
  })
  @ApiBadRequestResponse({
    description: `Bad request when update purchase location by id. Reason:
    - Invalid purchase location id,
    - Invalid group id`,
  })
  @ApiNotFoundResponse({
    description:
      'Purchase location not found. Reason: The purchase location id does not exist',
  })
  @ApiInternalServerErrorResponse({
    description: `Internal server error when update purchase location by id. Reason:
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
    description: 'The purchase location id',
    type: String,
  })
  @Put('/:groupId/:id')
  updatePurchaseLocation(
    @Param('groupId') groupId: string,
    @Param('id') id: string,
    @Body() reqDto: UpdatePurchaseLocationReqDto,
  ): Promise<UpdatePurchaseLocationResDto> {
    return this.purchaseLocationsService.updatePurchaseLocation(
      groupId,
      id,
      reqDto,
    );
  }
}
