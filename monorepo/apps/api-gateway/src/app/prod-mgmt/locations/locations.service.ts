import {
  CreatePurchaseLocationReqDto,
  CreatePurchaseLocationResDto,
  GetPurchaseLocationResDto,
  GetStorageLocationResDto,
} from 'libs/shared/src/lib/dto/prod-mgmt/locations';
import ms from 'ms';
import { firstValueFrom, timeout } from 'rxjs';

import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { kafkaTopic } from '@nyp19vp-be/shared';

@Injectable()
export class LocationsService {
  constructor(
    @Inject('PROD_MGMT_SERVICE')
    private readonly prodMgmtClient: ClientKafka,
  ) {}
  onModuleInit() {
    this.prodMgmtClient.subscribeToResponseOf(
      kafkaTopic.PROD_MGMT.storageLocations.create,
    );
    this.prodMgmtClient.subscribeToResponseOf(
      kafkaTopic.PROD_MGMT.purchaseLocations.create,
    );
    this.prodMgmtClient.subscribeToResponseOf(
      kafkaTopic.PROD_MGMT.purchaseLocations.getById,
    );
    this.prodMgmtClient.subscribeToResponseOf(
      kafkaTopic.PROD_MGMT.purchaseLocations.getById,
    );
  }

  async createPurchaseLocation(
    createPurchaseLocationReqDto: CreatePurchaseLocationReqDto,
  ): Promise<CreatePurchaseLocationResDto> {
    try {
      const res = await firstValueFrom(
        this.prodMgmtClient
          .send<CreatePurchaseLocationResDto, CreatePurchaseLocationReqDto>(
            kafkaTopic.PROD_MGMT.purchaseLocations.create,
            { ...createPurchaseLocationReqDto },
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
          .send<CreatePurchaseLocationResDto, CreatePurchaseLocationReqDto>(
            kafkaTopic.PROD_MGMT.storageLocations.create,
            { ...createPurchaseLocationReqDto },
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
            kafkaTopic.PROD_MGMT.purchaseLocations.getById,
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
          .send<GetStorageLocationResDto, string>(
            kafkaTopic.PROD_MGMT.storageLocations.getById,
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
