import { Inject, Injectable } from '@nestjs/common';
import { ZPCallbackReqDto, ZPCallbackResDto } from '@nyp19vp-be/shared';
import { zpconfig } from '../core/config/zalopay.config';
import { createHmac } from 'crypto';

@Injectable()
export class ZalopayService {
  constructor(
    @Inject('ZALOPAY_CONFIG') private readonly config: typeof zpconfig
  ) {}
  callback(callbackReqDto: ZPCallbackReqDto): Promise<ZPCallbackResDto> {
    let res;
    try {
      const dataStr = callbackReqDto.data;
      const reqMac = callbackReqDto.mac;
      const mac: string = createHmac('sha256', this.config.key2)
        .update(dataStr)
        .digest('hex');
      console.log('mac=', mac);
      if (reqMac !== mac) {
        return Promise.resolve({
          return_code: -1,
          return_message: 'mac not equal',
        });
      } else {
        return Promise.resolve({
          return_code: 1,
          return_message: 'success',
        });
      }
    } catch (error) {
      return Promise.resolve({
        return_code: 0,
        return_message: error.return_message,
      });
    }
  }
}
