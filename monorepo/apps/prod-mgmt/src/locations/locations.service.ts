import {
  CreatePurchaseLocationReqDto,
  CreatePurchaseLocationResDto,
  CreateStorageLocationReqDto,
  CreateStorageLocationResDto,
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
    const purchaseLocation = this.purchaseLocationRepo.create({
      id: createPurchaseLocation.id,
      name: createPurchaseLocation.name,
      address: createPurchaseLocation.address,
      addedBy: createPurchaseLocation.addedBy,
      group: {
        id: createPurchaseLocation.group.id,
        groupMongoId: createPurchaseLocation.group.groupMongoId,
      },
    });

    return {
      id: purchaseLocation.id,
      name: purchaseLocation.name,
      address: purchaseLocation.address,
      addedBy: purchaseLocation.addedBy,
      group: {
        id: purchaseLocation.group.id,
        groupMongoId: purchaseLocation.group.groupMongoId,
        timestamp: purchaseLocation.group.timestamp,
      },
      timestamp: purchaseLocation.timestamp,
    };
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
        id: purchaseLocation.id,
        name: purchaseLocation.name,
        addedBy: purchaseLocation.addedBy,
        address: purchaseLocation.address,
        timestamp: purchaseLocation.timestamp,
        group: {
          id: purchaseLocation.group.id,
          groupMongoId: purchaseLocation.group.groupMongoId,
          timestamp: purchaseLocation.group.timestamp,
        },
      },
    };
  }

  async createStorageLocation(
    createStorageLocation: CreateStorageLocationReqDto,
  ): Promise<CreateStorageLocationResDto> {
    const storageLocation = this.storageLocationRepo.create({
      ...createStorageLocation,
      group: {
        id: createStorageLocation.group.id,
        groupMongoId: createStorageLocation.group.groupMongoId,
      },
    });

    await this.storageLocationRepo.save(storageLocation);

    return {
      statusCode: HttpStatus.OK,
      message: 'Storage location found',
      data: {
        id: storageLocation.id,
        name: storageLocation.name,
        addedBy: storageLocation.addedBy,
        description: storageLocation.description,
        group: {
          id: storageLocation.group.id,
          groupMongoId: storageLocation.group.groupMongoId,
          timestamp: storageLocation.group.timestamp,
        },
      },
    };
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
        id: storageLocation.id,
        name: storageLocation.name,
        addedBy: storageLocation.addedBy,
        description: storageLocation.description,
        group: {
          id: storageLocation.group.id,
          groupMongoId: storageLocation.group.groupMongoId,
          groupProducts: undefined,
          purchaseLocations: undefined,
          storageLocations: undefined,
          timestamp: storageLocation.group.timestamp,
        },
      },
    };
  }
}
