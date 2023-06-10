import {
  CreateGroupProductReqDto,
  CreateGroupProductResDto,
  GetGroupProductsPaginatedReqDto,
  GetGroupProductsPaginatedResDto,
} from 'libs/shared/src/lib/dto/prod-mgmt/products';
import ms from 'ms';
import { PaginateQuery } from 'nestjs-paginate';
import { firstValueFrom, timeout } from 'rxjs';

import { HttpStatus, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { kafkaTopic } from '@nyp19vp-be/shared';

@Injectable()
export class GroupProductsService implements OnModuleInit {
  constructor(
    @Inject('PROD_MGMT_SERVICE')
    private readonly prodMgmtClient: ClientKafka,
  ) {}

  onModuleInit() {
    this.prodMgmtClient.subscribeToResponseOf(
      kafkaTopic.PROD_MGMT.groupProducts.create,
    );

    this.prodMgmtClient.subscribeToResponseOf(
      kafkaTopic.PROD_MGMT.groupProducts.getPaginated,
    );
  }

  async createGroupProduct(
    reqDto: CreateGroupProductReqDto,
  ): Promise<CreateGroupProductResDto> {
    try {
      const res = await firstValueFrom(
        this.prodMgmtClient
          .send<CreateGroupProductResDto, CreateGroupProductReqDto>(
            kafkaTopic.PROD_MGMT.groupProducts.create,
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

  async getGroupProductsPaginated(
    query: PaginateQuery,
    groupId: string,
  ): Promise<GetGroupProductsPaginatedResDto> {
    const reqDto: GetGroupProductsPaginatedReqDto = {
      ...query,
      groupId,
    };

    try {
      const res = await firstValueFrom(
        this.prodMgmtClient
          .send<
            GetGroupProductsPaginatedResDto,
            GetGroupProductsPaginatedReqDto
          >(kafkaTopic.PROD_MGMT.groupProducts.getPaginated, {
            ...reqDto,
          })
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
        data: undefined,
        links: undefined,
        meta: undefined,
      };
    }
  }
}
