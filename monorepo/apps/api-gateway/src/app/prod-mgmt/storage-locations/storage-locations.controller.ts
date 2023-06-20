import {
  storageLocationsFilterableColumns,
  storageLocationsSearchableColumns,
  storageLocationsSortableColumns,
} from 'libs/shared/src/lib/config';
import { StorageLocationDto } from 'libs/shared/src/lib/dto/prod-mgmt/dto/storage-location.dto';
import {
  CreateStorageLocationReqDto,
  CreateStorageLocationResDto,
  DeleteStorageLocationResDto,
  GetStorageLocationByIdResDto,
  GetStorageLocationsPaginatedResDto,
  RestoreStorageLocationResDto,
  UpdateStorageLocationReqDto,
  UpdateStorageLocationResDto,
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

import { StorageLocationsService } from './storage-locations.service';

@ApiTags('route: prod-mgmt', 'route: prod-mgmt/storage-locations')
@Controller('prod-mgmt/storage-locations')
export class StorageLocationsController {
  constructor(
    private readonly storageLocationsService: StorageLocationsService,
  ) {}

  @ApiOperation({
    summary: 'Create storage location',
    description: 'Create storage location',
  })
  @ApiCreatedResponse({
    description: 'Create storage location',
    type: CreateStorageLocationResDto,
  })
  @ApiBadRequestResponse({
    description: `Bad request when create storage location. Reason:
    - Invalid group id`,
  })
  @ApiInternalServerErrorResponse({
    description: `Internal server error when create storage location. Reason:
    - Timeout when connect to database
    - Timeout when connect to kafka microservice`,
  })
  @Post()
  async createStorageLocation(
    @Body() reqDto: CreateStorageLocationReqDto,
  ): Promise<CreateStorageLocationResDto> {
    return this.storageLocationsService.createStorageLocation(reqDto);
  }

  @ApiOperation({
    summary: 'Get storage location by id',
    description: 'Get storage location by id',
  })
  @ApiOkResponse({
    description: 'Get storage location by id',
    type: GetStorageLocationByIdResDto,
  })
  @ApiBadRequestResponse({
    description: `Bad request when get storage location by id. Reason:
    - Invalid storage location id,
    - Invalid group id`,
  })
  @ApiNotFoundResponse({
    description:
      'Storage location not found. Reason: The storage location id does not exist',
  })
  @ApiInternalServerErrorResponse({
    description: `Internal server error when get storage location by id. Reason:
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
  @Get('/:groupId/:id')
  async getStorageLocationById(
    @Param('groupId') groupId: string,
    @Param('id') id: string,
  ): Promise<GetStorageLocationByIdResDto> {
    return this.storageLocationsService.getStorageLocationById(groupId, id);
  }

  @ApiOperation({
    summary: 'Get **PAGINATED** storage locations',
    description: 'Get **PAGINATED** storage locations',
  })
  @PaginateQueryOptions(
    StorageLocationDto,
    storageLocationsSearchableColumns,
    storageLocationsSortableColumns,
    storageLocationsFilterableColumns,
  )
  @Get('/:groupId')
  async getStorageLocationsPaginated(
    @Paginate() query: PaginateQuery,
    @Param('groupId') groupId: string,
  ): Promise<GetStorageLocationsPaginatedResDto> {
    return this.storageLocationsService.getStorageLocationsPaginated(
      query,
      groupId,
    );
  }

  @ApiOperation({
    summary: 'Delete storage location by id',
    description: 'Delete storage location by id',
  })
  @ApiOkResponse({
    description: 'Delete storage location by id',
    type: DeleteStorageLocationResDto,
  })
  @ApiBadRequestResponse({
    description: `Bad request when delete storage location by id. Reason:
    - Invalid storage location id,
    - Invalid group id`,
  })
  @ApiNotFoundResponse({
    description:
      'Storage location not found. Reason: The storage location id does not exist',
  })
  @ApiInternalServerErrorResponse({
    description: `Internal server error when delete storage location by id. Reason:
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
    description: 'The storage location id',
    type: String,
  })
  @Delete('/:groupId/:id')
  async deleteStorageLocation(
    @Param('groupId') groupId: string,
    @Param('id') id: string,
  ): Promise<DeleteStorageLocationResDto> {
    return this.storageLocationsService.deleteStorageLocation(groupId, id);
  }

  @ApiOperation({
    summary: 'Restore storage location by id',
    description: 'Restore storage location by id',
  })
  @ApiOkResponse({
    description: 'Restore storage location by id',
    type: RestoreStorageLocationResDto,
  })
  @ApiBadRequestResponse({
    description: `Bad request when restore storage location by id. Reason:
    - Invalid storage location id,
    - Invalid group id`,
  })
  @ApiNotFoundResponse({
    description:
      'Storage location not found. Reason: The storage location id does not exist',
  })
  @ApiInternalServerErrorResponse({
    description: `Internal server error when restore storage location by id. Reason:
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
    description: 'The storage location id',
    type: String,
  })
  @Patch('/:groupId/:id')
  async restoreStorageLocation(
    @Param('groupId') groupId: string,
    @Param('id') id: string,
  ): Promise<RestoreStorageLocationResDto> {
    return this.storageLocationsService.restoreStorageLocation(groupId, id);
  }

  @ApiOperation({
    summary: 'Update storage location by id',
    description: 'Update storage location by id',
  })
  @ApiOkResponse({
    description: 'Update storage location by id',
    type: UpdateStorageLocationResDto,
  })
  @ApiBadRequestResponse({
    description: `Bad request when update storage location by id. Reason:
    - Invalid storage location id,
    - Invalid group id`,
  })
  @ApiNotFoundResponse({
    description:
      'Storage location not found. Reason: The storage location id does not exist',
  })
  @ApiInternalServerErrorResponse({
    description: `Internal server error when update storage location by id. Reason:
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
    description: 'The storage location id',
    type: String,
  })
  @Put('/:groupId/:id')
  async updateStorageLocation(
    @Param('groupId') groupId: string,
    @Param('id') id: string,
    @Body() reqDto: UpdateStorageLocationReqDto,
  ): Promise<UpdateStorageLocationResDto> {
    return this.storageLocationsService.updateStorageLocation(
      groupId,
      id,
      reqDto,
    );
  }
}
