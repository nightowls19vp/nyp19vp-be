import { Inject, Injectable } from '@nestjs/common';
import { createHmac } from 'crypto';
import { zpconfig } from './core/config/zalopay.config';
import { ZPCallbackReqDto, ZPCallbackResDto } from '@nyp19vp-be/shared';

@Injectable()
export class AppService {
  constructor(
    @Inject('ZALOPAY_CONFIG') private readonly config: typeof zpconfig
  ) {}
  getData(): { message: string } {
    return { message: 'Welcome to api-gateway!' };
  }
  callback(callbackReqDto: ZPCallbackReqDto): Promise<ZPCallbackResDto> {
    let res: ZPCallbackResDto;
    try {
      const dataStr = callbackReqDto.data;
      const reqMac = callbackReqDto.mac;
      const mac: string = createHmac('sha256', this.config.key2)
        .update(dataStr)
        .digest('hex');
      console.log('mac=', mac);
      if (reqMac !== mac) {
        res = {
          return_code: -1,
          return_message: 'mac not equal',
        };
      } else {
        res = {
          return_code: 1,
          return_message: 'success',
        };
      }
    } catch (error) {
      res = {
        return_code: 0,
        return_message: error.return_message,
      };
    }
    return Promise.resolve(res);
  }
}
