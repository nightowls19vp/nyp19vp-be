import {
  CreatePurchaseLocationReqDto,
  CreatePurchaseLocationResDto,
  CreateStorageLocationReqDto,
  CreateStorageLocationResDto,
  GetStorageLocationResDto,
} from 'libs/shared/src/lib/dto/prod-mgmt/locations';

import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { kafkaTopic } from '@nyp19vp-be/shared';

import { GetPurchaseLocationResDto } from '../../../../libs/shared/src/lib/dto/prod-mgmt/locations/index';
import { LocationsService } from './locations.service';

@Controller()
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @MessagePattern(kafkaTopic.PROD_MGMT.purchaseLocations.create)
  async createPurchaseLocation(
    @Payload() data: CreatePurchaseLocationReqDto,
  ): Promise<CreatePurchaseLocationResDto> {
    console.log('#kafkaTopic.PROD_MGMT.purchaseLocations.create', data);

    return this.locationsService.createPurchaseLocation(data);
  }

  @MessagePattern(kafkaTopic.PROD_MGMT.purchaseLocations.getById)
  async getPurchaseLocationById(
    @Payload() id: string,
  ): Promise<GetPurchaseLocationResDto> {
    console.log('#kafkaTopic.PROD_MGMT.purchaseLocations.getById', id);

    return this.locationsService.getPurchaseLocationById(id);
  }

  /* ----------- */
  @MessagePattern(kafkaTopic.PROD_MGMT.storageLocations.create)
  async createStorageLocation(
    @Payload() data: CreateStorageLocationReqDto,
  ): Promise<CreateStorageLocationResDto> {
    console.log('#kafkaTopic.PROD_MGMT.storageLocations.create', data);

    return this.locationsService.createStorageLocation(data);
  }

  @MessagePattern(kafkaTopic.PROD_MGMT.storageLocations.getById)
  async getStorageLocationById(
    @Payload() id: string,
  ): Promise<GetStorageLocationResDto> {
    console.log('#kafkaTopic.PROD_MGMT.storageLocations.getById', id);

    return this.locationsService.getStorageLocationById(id);
  }
}
