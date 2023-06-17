import { ItemDto } from 'libs/shared/src/lib/dto/prod-mgmt/dto/item.dto';
import {
  CreateItemReqDto,
  CreateItemResDto,
  DeleteItemReqDto,
  DeleteItemResDto,
  GetItemByIdReqDto,
  GetItemByIdResDto,
  GetItemsPaginatedReqDto,
  RestoreItemReqDto,
  RestoreItemResDto,
  UpdateItemReqDto,
  UpdateItemResDto,
} from 'libs/shared/src/lib/dto/prod-mgmt/items';
import moment from 'moment';
import { Repository } from 'typeorm';

import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';

import { GroupProductEntity } from '../entities/group-product.entity';
import { ItemEntity } from '../entities/item.entity';
import { PurchaseLocationEntity } from '../entities/purchase-location.entity';
import { StorageLocationEntity } from '../entities/storage-location.entity';
import { GroupsProductsService } from '../groups-products/groups-products.service';
import { PurchaseLocationsService } from '../purchase-locations/purchase-locations.service';
import { StorageLocationsService } from '../storage-locations/storage-locations.service';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(GroupProductEntity)
    private readonly groupProductRepo: Repository<GroupProductEntity>,

    @InjectRepository(StorageLocationEntity)
    private readonly storageLocationRepo: Repository<StorageLocationEntity>,

    @InjectRepository(PurchaseLocationEntity)
    private readonly purchaseLocationRepo: Repository<PurchaseLocationEntity>,

    @InjectRepository(ItemEntity)
    private readonly itemRepo: Repository<ItemEntity>,
  ) {}

  public static toDto(item: ItemEntity): ItemDto {
    return {
      id: item.id,
      addedBy: item.addedBy,
      bestBefore: item.bestBefore,
      image: item.image,
      quantity: item.quantity,
      unit: item.unit,
      timestamp: item.timestamp,
      groupProduct: GroupsProductsService.toDto(item.groupProduct),
      purchaseLocation: PurchaseLocationsService.toDto(
        item.purchaseLocation,
        false,
      ),
      storageLocation: StorageLocationsService.toDto(
        item.storageLocation,
        false,
      ),
    };
  }

  async create(reqDto: CreateItemReqDto): Promise<CreateItemResDto> {
    const [groupProduct, storageLocation, purchaseLocation] = await Promise.all(
      [
        this.groupProductRepo.findOne({
          where: {
            id: reqDto.groupProductId,
          },
        }),
        this.storageLocationRepo.findOne({
          where: {
            id: reqDto.storageLocationId,
          },
        }),
        this.purchaseLocationRepo.findOne({
          where: {
            id: reqDto.purchaseLocationId,
          },
        }),
      ],
    );

    // check if groupProduct, storageLocation, purchaseLocation exist
    if (!groupProduct) {
      throw new RpcException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: `GroupProduct with id ${reqDto.groupProductId} does not exist`,
      });
    }

    if (!storageLocation) {
      throw new RpcException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: `StorageLocation with id ${reqDto.storageLocationId} does not exist`,
      });
    }

    if (!purchaseLocation) {
      throw new RpcException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: `PurchaseLocation with id ${reqDto.purchaseLocationId} does not exist`,
      });
    }

    const item = this.itemRepo.create({
      addedBy: reqDto.addedBy,
      bestBefore: moment(reqDto.bestBefore).toDate(),
      quantity: reqDto.quantity,
      unit: reqDto.unit,
      image: reqDto.image ?? groupProduct.image,
      groupProduct: groupProduct,
      storageLocation: storageLocation,
      purchaseLocation: purchaseLocation,
    });

    await this.itemRepo.save(item);

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Item created successfully',
      data: ItemsService.toDto(item),
    };
  }

  async getById(reqDto: GetItemByIdReqDto): Promise<GetItemByIdResDto> {
    const item = await this.itemRepo.findOneBy({
      id: reqDto.id,
    });

    if (!item) {
      throw new RpcException({
        statusCode: HttpStatus.NOT_FOUND,
        message: `Item with id ${reqDto.id} does not exist`,
      });
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'Item retrieved successfully',
      data: ItemsService.toDto(item),
    };
  }

  async getPaginated(
    reqDto: GetItemsPaginatedReqDto,
  ): Promise<GetItemByIdResDto> {
    throw new RpcException('Method not implemented.' + reqDto);
  }

  async update(reqDto: UpdateItemReqDto): Promise<UpdateItemResDto> {
    throw new RpcException('Method not implemented.' + reqDto);
  }

  async delete(reqDto: DeleteItemReqDto): Promise<DeleteItemResDto> {
    throw new RpcException('Method not implemented.' + reqDto);
  }

  async restore(reqDto: RestoreItemReqDto): Promise<RestoreItemResDto> {
    throw new RpcException('Method not implemented.' + reqDto);
  }
}
