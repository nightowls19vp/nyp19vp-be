import { Body, Controller, Inject, Param, Post, Req } from '@nestjs/common';
import { ZalopayService } from './zalopay.service';
import {
  ParseObjectIdPipe,
  UpdateCartReqDto,
  ZPCallbackReqDto,
  ZPCallbackResDto,
  ZPCreateOrderResDto,
  kafkaTopic,
} from '@nyp19vp-be/shared';
import { ClientKafka } from '@nestjs/microservices';

@Controller('zalopay')
export class ZalopayController {
  constructor(
    private readonly zalopayService: ZalopayService,
    @Inject('TXN_SERVICE') private readonly txnClient: ClientKafka
  ) {}

  async onModuleInit() {
    this.txnClient.subscribeToResponseOf(kafkaTopic.HEALT_CHECK.TXN);
    for (const key in kafkaTopic.TXN) {
      this.txnClient.subscribeToResponseOf(kafkaTopic.TXN[key]);
    }
    await Promise.all([this.txnClient.connect()]);
  }

  @Post('/callback')
  callback(@Body() req: string): any {
    console.log(req);
    let callbackReqDto: ZPCallbackReqDto;
    if (typeof req === 'object') callbackReqDto = req;
    else if (typeof req === 'string') callbackReqDto = JSON.parse(req);
    return this.zalopayService.callback(callbackReqDto);
  }

  @Post()
  checkout(
    @Body() updateCartReqDto: UpdateCartReqDto
  ): Promise<ZPCreateOrderResDto> {
    return this.zalopayService.checkout(updateCartReqDto);
  }
}
