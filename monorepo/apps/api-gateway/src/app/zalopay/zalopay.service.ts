import { Inject, Injectable } from '@nestjs/common';
import {
  UpdateCartReqDto,
  ZPCallbackReqDto,
  ZPCallbackResDto,
  kafkaTopic,
} from '@nyp19vp-be/shared';
import { zpconfig } from '../core/config/zalopay.config';
import { createHmac } from 'crypto';
import { firstValueFrom } from 'rxjs';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class ZalopayService {
  constructor(
    @Inject('ZALOPAY_CONFIG') private readonly config: typeof zpconfig,
    @Inject('TXN_SERVICE') private readonly txnClient: ClientKafka
  ) {}
  callback(callbackReqDto: ZPCallbackReqDto): any {
    try {
      const dataStr = callbackReqDto.data;
      const reqMac = callbackReqDto.mac;
      const mac: string = createHmac('sha256', this.config.key2)
        .update(dataStr)
        .digest('hex');
      console.log('mac=', mac);
      if (reqMac !== mac) {
        return JSON.stringify({
          return_code: -1,
          return_message: 'mac not equal',
        });
      } else {
        return JSON.stringify({
          return_code: 1,
          return_message: 'success',
        });
      }
    } catch (error) {
      return JSON.stringify({
        return_code: 0,
        return_message: error.return_message,
      });
    }
  }
  // async checkout(updateCartReqDto: UpdateCartReqDto): Promise<any> {
  //   return await firstValueFrom(
  //     this.txnClient.send(kafkaTopic.TXN.CHECKOUT, updateCartReqDto)
  //   );
  // }
}
