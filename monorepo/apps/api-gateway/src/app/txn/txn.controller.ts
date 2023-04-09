import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  OnModuleInit,
  Inject,
} from '@nestjs/common';
import { TxnService } from './txn.service';
import {
  UpdateCartReqDto,
  UpdateCartResDto,
  kafkaTopic,
} from '@nyp19vp-be/shared';
import { ClientKafka } from '@nestjs/microservices';

@Controller('txn')
export class TxnController implements OnModuleInit {
  constructor(
    private readonly txnService: TxnService,
    @Inject('TXN_SERVICE') private readonly txnClient: ClientKafka
  ) {}
  async onModuleInit() {
    this.txnClient.subscribeToResponseOf(kafkaTopic.HEALT_CHECK.TXN);
    for (const key in kafkaTopic.TXN) {
      this.txnClient.subscribeToResponseOf(kafkaTopic.TXN[key]);
    }
    await Promise.all([this.txnClient.connect()]);
  }

  @Post()
  create(@Body() updateCartReqDto: UpdateCartReqDto): Promise<any> {
    console.log('purchase by zalopay');
    return this.txnService.create(updateCartReqDto);
  }
}
