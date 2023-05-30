import {
  CreatePurchaseLocationReqDto,
  CreatePurchaseLocationResDto,
  GetPurchaseLocationResDto,
  GetStorageLocationResDto,
} from 'libs/shared/src/lib/dto/prod-mgmt/locations';
import { Repository } from 'typeorm';

import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { PurchaseLocationEntity } from '../entities/purchase-location.entity';
import { StorageLocationEntity } from '../entities/storage-location.entity';

@Injectable()
export class LocationsService {
  constructor(
    @InjectRepository(PurchaseLocationEntity)
    private readonly purchaseLocationRepo: Repository<PurchaseLocationEntity>,

    @InjectRepository(StorageLocationEntity)
    private readonly storageLocationRepo: Repository<StorageLocationEntity>,
  ) {}

  async createPurchaseLocation(
    createPurchaseLocation: CreatePurchaseLocationReqDto,
  ): Promise<CreatePurchaseLocationResDto> {
    const purchaseLocation = await this.purchaseLocationRepo.save(
      createPurchaseLocation,
    );

    return { ...purchaseLocation };
  }

  async getPurchaseLocationById(
    id: string,
  ): Promise<GetPurchaseLocationResDto> {
    const purchaseLocation = await this.purchaseLocationRepo.findOneBy({
      id,
    });

    if (!purchaseLocation) {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Purchase location not found',
        data: null,
      };
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'Purchase location found',
      data: {
        ...purchaseLocation,
      },
    };
  }

  async createStorageLocation(
    createStorageLocation: CreatePurchaseLocationReqDto,
  ): Promise<CreatePurchaseLocationResDto> {
    const storageLocation = await this.storageLocationRepo.save(
      createStorageLocation,
    );

    return { ...storageLocation };
  }

  async getStorageLocationById(id: string): Promise<GetStorageLocationResDto> {
    const storageLocation = await this.storageLocationRepo.findOneBy({
      id,
    });

    if (!storageLocation) {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Storage location not found',
        data: null,
      };
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'Storage location found',
      data: {
        ...storageLocation,
      },
    };
  }
}
