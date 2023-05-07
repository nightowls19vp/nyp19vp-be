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
  Query,
} from '@nestjs/common';
import { TxnService } from './txn.service';
import {
  CreateTransReqDto,
  UpdateCartReqDto,
  ZPCallbackReqDto,
  ZPGetOrderStatusReqDto,
  kafkaTopic,
} from '@nyp19vp-be/shared';
import { ClientKafka } from '@nestjs/microservices';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('Transaction')
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

  @Post('zalopay/stt')
  checkout(@Body() createTransReqDto: CreateTransReqDto): Promise<any> {
    console.log('Get Status', createTransReqDto);
    return this.txnService.zpGetStatus(createTransReqDto);
  }

  @Post('zalopay/callback')
  zpCallback(@Body() req): any {
    console.log(req);
    let callbackReqDto: ZPCallbackReqDto;
    if (typeof req === 'object') callbackReqDto = req;
    else if (typeof req === 'string') callbackReqDto = JSON.parse(req);
    return this.txnService.zpCallback(callbackReqDto);
  }
}
