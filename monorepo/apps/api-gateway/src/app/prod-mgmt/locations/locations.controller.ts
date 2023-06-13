import {
  CreatePurchaseLocationReqDto,
  CreatePurchaseLocationResDto,
  CreateStorageLocationReqDto,
  CreateStorageLocationResDto,
} from 'libs/shared/src/lib/dto/prod-mgmt/locations';

import { Body, Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';

import { LocationsService } from './locations.service';

@ApiTags('route: prod-mgmt', 'route: prod-mgmt/locations')
@Controller('prod-mgmt/locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: CreatePurchaseLocationResDto,
  })
  @Post('purchase')
  async createPurchaseLocation(
    @Body() data: CreatePurchaseLocationReqDto,
  ): Promise<CreatePurchaseLocationResDto> {
    return this.locationsService.createPurchaseLocation(data);
  }

  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: CreatePurchaseLocationResDto,
  })
  @Post('storage')
  async createStorageLocation(
    @Body() data: CreateStorageLocationReqDto,
  ): Promise<CreateStorageLocationResDto> {
    return this.locationsService.createStorageLocation(data);
  }
}
