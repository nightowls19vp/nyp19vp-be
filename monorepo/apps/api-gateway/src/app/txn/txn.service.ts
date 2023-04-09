import { Inject, Injectable } from '@nestjs/common';
import {
  UpdateCartReqDto,
  UpdateCartResDto,
  kafkaTopic,
} from '@nyp19vp-be/shared';
import { firstValueFrom } from 'rxjs';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class TxnService {
  constructor(@Inject('TXN_SERVICE') private readonly txnClient: ClientKafka) {}

  async create(updateCartReqDto: UpdateCartReqDto): Promise<any> {
    return await firstValueFrom(
      this.txnClient.send(kafkaTopic.TXN.CHECKOUT, updateCartReqDto)
    );
  }
}
