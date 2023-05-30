import { Inject, Injectable, RequestTimeoutException } from '@nestjs/common';
import {
  CreateTransReqDto,
  VNPIpnUrlReqDto,
  ZPCallbackReqDto,
  ZPDataCallback,
  kafkaTopic,
} from '@nyp19vp-be/shared';
import { createHmac } from 'crypto';
import { ClientKafka } from '@nestjs/microservices';
import { catchError, firstValueFrom, timeout } from 'rxjs';
import { SocketService } from '../socket/socket.service';

@Injectable()
export class TxnService {
  constructor(
    @Inject('ZALOPAY_CONFIG') private readonly zpconfig,
    @Inject('TXN_SERVICE') private readonly txnClient: ClientKafka,
    private readonly socketService: SocketService,
  ) {}
  async zpCallback(callbackReqDto: ZPCallbackReqDto) {
    try {
      const dataStr = callbackReqDto.data;
      const reqMac = callbackReqDto.mac;
      const mac: string = createHmac('sha256', this.zpconfig.key2)
        .update(dataStr)
        .digest('hex');
      console.log('mac=', mac);
      if (reqMac !== mac) {
        return JSON.stringify({
          return_code: -1,
          return_message: 'mac not equal',
        });
      } else {
        let zpDataCallback: ZPDataCallback;
        if (typeof dataStr === 'object') {
          zpDataCallback = dataStr;
        } else if (typeof dataStr === 'string') {
          zpDataCallback = JSON.parse(dataStr);
        }
        await firstValueFrom(
          this.txnClient.send(
            kafkaTopic.TXN.ZP_CREATE_TRANS,
            JSON.stringify(zpDataCallback),
          ),
        );
        await this.socketService.zalopay_callback(
          zpDataCallback.app_user,
          dataStr,
        );
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
  async zpGetStatus(createTransReqDto: CreateTransReqDto): Promise<any> {
    return await firstValueFrom(
      this.txnClient
        .send(kafkaTopic.TXN.ZP_GET_STT, JSON.stringify(createTransReqDto))
        .pipe(
          timeout(5000),
          catchError(() => {
            throw new RequestTimeoutException();
          }),
        ),
    );
  }
  async vnpCallback(vnpIpnUrlReqDto: VNPIpnUrlReqDto): Promise<any> {
    return await firstValueFrom(
      this.txnClient
        .send(kafkaTopic.TXN.VNP_CALLBACK, JSON.stringify(vnpIpnUrlReqDto))
        .pipe(
          timeout(3000),
          catchError(() => {
            throw new RequestTimeoutException();
          }),
        ),
    );
  }
}
