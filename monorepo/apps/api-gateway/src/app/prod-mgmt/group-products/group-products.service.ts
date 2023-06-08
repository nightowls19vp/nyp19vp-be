import {
  CreateGroupProductReqDto,
  CreateGroupProductResDto,
} from 'libs/shared/src/lib/dto/prod-mgmt/products';

import { HttpStatus, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { kafkaTopic } from '@nyp19vp-be/shared';
import { firstValueFrom, timeout } from 'rxjs';
import ms from 'ms';
import { time } from 'console';

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
}
