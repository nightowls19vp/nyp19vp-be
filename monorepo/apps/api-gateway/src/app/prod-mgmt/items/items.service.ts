import {
  CreateItemReqDto,
  CreateItemResDto,
  GetItemByIdReqDto,
  GetItemByIdResDto,
  GetItemsPaginatedResDto,
} from 'libs/shared/src/lib/dto/prod-mgmt/items';
import ms from 'ms';
import { PaginateQuery } from 'nestjs-paginate';
import { firstValueFrom, timeout } from 'rxjs';

import { HttpStatus, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { kafkaTopic } from '@nyp19vp-be/shared';

@Injectable()
export class ItemsService implements OnModuleInit {
  constructor(
    @Inject('PROD_MGMT_SERVICE')
    private readonly prodMgmtClient: ClientKafka,
  ) {}

  onModuleInit() {
    const groupProductTopics = Object.values(kafkaTopic.PROD_MGMT.items);

    console.log(
      '#kafkaTopic.PROD_MGMT.groupProducts',
      groupProductTopics.join(', '),
    );

    for (const topic of groupProductTopics) {
      this.prodMgmtClient.subscribeToResponseOf(topic);
    }
  }
  async createItem(reqDto: CreateItemReqDto): Promise<CreateItemResDto> {
    try {
      const res = await firstValueFrom(
        this.prodMgmtClient
          .send<CreateItemResDto, CreateItemReqDto>(
            kafkaTopic.PROD_MGMT.items.create,
            {
              ...reqDto,
            },
          )
          .pipe(timeout(ms('5s'))),
      );

      return res;
    } catch (error) {
      console.log('error', error);
      return {
        statusCode:
          error?.status ??
          error?.code ??
          error?.statusCode ??
          HttpStatus.INTERNAL_SERVER_ERROR,
        message: error?.message ?? 'Internal Server Error',
      };
    }
  }
  async getItemById(id: string): Promise<GetItemByIdResDto> {
    try {
      const res = await firstValueFrom(
        this.prodMgmtClient
          .send<GetItemByIdResDto, GetItemByIdReqDto>(
            kafkaTopic.PROD_MGMT.items.getById,
            {
              id: id,
            },
          )
          .pipe(timeout(ms('5s'))),
      );

      return res;
    } catch (error) {
      console.log('error', error);
      return {
        statusCode:
          error?.status ??
          error?.code ??
          error?.statusCode ??
          HttpStatus.INTERNAL_SERVER_ERROR,
        message: error?.message ?? 'Internal Server Error',
      };
    }
  }
  async getItemsPaginated(
    query: PaginateQuery,
  ): Promise<GetItemsPaginatedResDto> {
    throw new Error('Method not implemented.');
  }
  deleteItem(id: string) {
    throw new Error('Method not implemented.');
  }
  restoreItem(id: string) {
    throw new Error('Method not implemented.');
  }
}
