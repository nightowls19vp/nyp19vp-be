import {
  CreatePurchaseLocationReqDto,
  CreatePurchaseLocationResDto,
  GetPurchaseLocationResDto,
  GetStorageLocationResDto,
} from 'libs/shared/src/lib/dto/prod-mgmt/locations';
import ms from 'ms';
import { firstValueFrom, timeout } from 'rxjs';

import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { kafkaTopic } from '@nyp19vp-be/shared';

@Injectable()
export class LocationService implements OnModuleInit {
  constructor(
    @Inject('PROD_MGMT_SERVICE')
    private readonly prodMgmtClient: ClientKafka,
  ) {}
  onModuleInit() {
    this.prodMgmtClient.subscribeToResponseOf(
      kafkaTopic.PROD_MGMT.create_purchase_location,
    );
    this.prodMgmtClient.subscribeToResponseOf(
      kafkaTopic.PROD_MGMT.create_storage_location,
    );
    this.prodMgmtClient.subscribeToResponseOf(
      kafkaTopic.PROD_MGMT.get_purchase_location_by_id,
    );
    this.prodMgmtClient.subscribeToResponseOf(
      kafkaTopic.PROD_MGMT.get_storage_location_by_id,
    );
  }

  async createPurchaseLocation(
    createPurchaseLocationReqDto: CreatePurchaseLocationReqDto,
  ): Promise<CreatePurchaseLocationResDto> {
    try {
      const res = await firstValueFrom(
        this.prodMgmtClient
          .send<CreatePurchaseLocationReqDto>(
            kafkaTopic.PROD_MGMT.create_purchase_location,
            JSON.stringify(createPurchaseLocationReqDto),
          )
          .pipe(timeout(ms('5s'))),
      );

      return res;
    } catch (error) {
      console.log('error', error);

      return null;
    }
  }

  async createStorageLocation(
    createPurchaseLocationReqDto: CreatePurchaseLocationReqDto,
  ): Promise<CreatePurchaseLocationResDto> {
    try {
      const res = await firstValueFrom(
        this.prodMgmtClient
          .send(
            kafkaTopic.PROD_MGMT.create_storage_location,
            JSON.stringify(createPurchaseLocationReqDto),
          )
          .pipe(timeout(ms('5s'))),
      );

      return res;
    } catch (error) {
      console.log('error', error);

      return null;
    }
  }

  async getPurchaseLocationById(
    id: string,
  ): Promise<GetPurchaseLocationResDto> {
    try {
      const res = await firstValueFrom(
        this.prodMgmtClient
          .send<GetPurchaseLocationResDto, string>(
            kafkaTopic.PROD_MGMT.get_purchase_location_by_id,
            id,
          )
          .pipe(timeout(ms('5s'))),
      );

      return res;
    } catch (error) {
      console.log('error', error);

      return null;
    }
  }

  async getStorageLocationById(id: string): Promise<GetStorageLocationResDto> {
    try {
      const res = await firstValueFrom(
        this.prodMgmtClient
          .send<GetStorageLocationResDto,   string>(
            kafkaTopic.PROD_MGMT.get_storage_location_by_id,
            id,
          )
          .pipe(timeout(ms('5s'))),
      );

      return res;
    } catch (error) {
      console.log('error', error);

      return null;
    }
  }
}
