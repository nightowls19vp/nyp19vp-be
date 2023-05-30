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

  @MessagePattern(kafkaTopic.PROD_MGMT.create_purchase_location)
  async createPurchaseLocation(
    @Payload() data: CreatePurchaseLocationReqDto,
  ): Promise<CreatePurchaseLocationResDto> {
    return this.locationsService.createPurchaseLocation(data);
  }

  @MessagePattern(kafkaTopic.PROD_MGMT.get_purchase_location_by_id)
  async getPurchaseLocationById(
    @Payload() id: string,
  ): Promise<GetPurchaseLocationResDto> {
    return this.locationsService.getPurchaseLocationById(id);
  }

  /* ----------- */
  @MessagePattern(kafkaTopic.PROD_MGMT.create_storage_location)
  async createStorageLocation(
    @Payload() data: CreateStorageLocationReqDto,
  ): Promise<CreatePurchaseLocationResDto> {
    return this.locationsService.createStorageLocation(data);
  }

  @MessagePattern(kafkaTopic.PROD_MGMT.get_storage_location_by_id)
  async getStorageLocationById(
    @Payload() id: string,
  ): Promise<GetStorageLocationResDto> {
    return this.locationsService.getStorageLocationById(id);
  }
}
