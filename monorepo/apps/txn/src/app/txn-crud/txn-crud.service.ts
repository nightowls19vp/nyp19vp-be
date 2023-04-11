import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import {
  ItemDto,
  Items,
  PackageDto,
  UpdateCartReqDto,
  kafkaTopic,
  ZPCreateOrderReqDto,
  ZPCreateOrderResDto,
  ZPGetOrderStatusResDto,
  ZPGetOrderStatusReqDto,
} from '@nyp19vp-be/shared';
import { Observable, catchError, firstValueFrom, of, timeout } from 'rxjs';
import { ClientKafka } from '@nestjs/microservices';
import { createHmac } from 'crypto';
import { HttpService } from '@nestjs/axios';
import { AxiosError, AxiosResponse } from 'axios';
import { zpconfig } from '../../core/config/zalopay.config';
import { setIntervalAsync, clearIntervalAsync } from 'set-interval-async';

@Injectable()
export class TxnCrudService implements OnModuleInit {
  constructor(
    private httpService: HttpService,
    @Inject('PKG_MGMT_SERVICE') private readonly pkgMgmtClient: ClientKafka,
    @Inject('ZALOPAY_CONFIG') private readonly config: typeof zpconfig
  ) {}
  async onModuleInit() {
    this.pkgMgmtClient.subscribeToResponseOf(
      kafkaTopic.HEALT_CHECK.PACKAGE_MGMT
    );
    for (const key in kafkaTopic.PACKAGE_MGMT) {
      this.pkgMgmtClient.subscribeToResponseOf(kafkaTopic.PACKAGE_MGMT[key]);
    }
    await Promise.all([this.pkgMgmtClient.connect()]);
  }

  async checkout(updateCartReqDto: UpdateCartReqDto): Promise<any> {
    const { _id = '6425a5f3f1757ad283e82b23', cart } = updateCartReqDto;
    const list_id = cart.map((x) => x.package);
    const res1 = this.pkgMgmtClient
      .send(kafkaTopic.PACKAGE_MGMT.GET_MANY_PKG, list_id)
      .pipe(
        timeout(5000),
        catchError(() => of(`Request timed out after: 5s`))
      )
      .subscribe(async (res: PackageDto[]) => {
        const zaloPayReq = mapZaloPayReqDto(
          _id,
          mapPkgDtoToItemDto(res, cart),
          this.config
        );
        console.log(zaloPayReq);
        const zaloRes = await this.zpCreateOrder(zaloPayReq);
        console.log(zaloRes);
        const { app_id, app_trans_id } = zaloPayReq;
        const zpGetOrderStatusReqDto: ZPGetOrderStatusReqDto =
          mapZPGetStatusReqDto(app_id, app_trans_id, this.config);
        this.CheckStatus(zpGetOrderStatusReqDto);
      });
  }

  CheckStatus(zpGetOrderStatusReqDto: ZPGetOrderStatusReqDto) {
    let timer;
    // eslint-disable-next-line prefer-const
    timer = setIntervalAsync(async () => {
      const res: ZPGetOrderStatusResDto = await this.zpGetOrderStatus(
        zpGetOrderStatusReqDto
      );
      if (res.return_code == 1) {
        console.log(res);
        await clearIntervalAsync(timer);
      }
    }, 15000);

    setTimeout(async () => {
      await clearIntervalAsync(timer);
      console.log('stop timeout');
    }, 15 * 60 * 1000);
  }

  async zpCreateOrder(
    zalopayReqDto: ZPCreateOrderReqDto
  ): Promise<ZPCreateOrderResDto> {
    const { data } = await firstValueFrom(
      this.httpService
        .post(this.config.create_order_endpoint, null, {
          params: zalopayReqDto,
        })
        .pipe(
          catchError((error: AxiosError) => {
            throw error.response.data;
          })
        )
    );
    return data;
  }

  async zpGetOrderStatus(
    zpGetOrderStatusReqDto: ZPGetOrderStatusReqDto
  ): Promise<ZPGetOrderStatusResDto> {
    const { data } = await firstValueFrom(
      this.httpService
        .post(this.config.get_status_endpoint, null, {
          params: zpGetOrderStatusReqDto,
        })
        .pipe(
          catchError((error: AxiosError) => {
            throw error.response.data;
          })
        )
    );
    return data;
  }
}
function padTo2Digits(num: number) {
  return num.toString().padStart(2, '0');
}
const mapPkgDtoToItemDto = (
  listPkg: PackageDto[],
  cart: Items[]
): ItemDto[] => {
  let idx = 0;
  const ListItem: ItemDto[] = cart.map((i) => {
    const item: ItemDto = {
      id: i.package,
      name: listPkg.at(idx).name,
      price: listPkg.at(idx).price,
      quantity: i.quantity,
    };
    idx++;
    return item;
  });
  return ListItem;
};
const totalPrice = (items: ItemDto[]): number => {
  let total = 0;
  for (const elem of items) {
    total += elem.price * elem.quantity;
  }
  return total * 1000;
};
const getTransId = (): string => {
  const date = new Date();
  const time = date.toLocaleTimeString().split(/[\s:]/);
  if (time[3] == 'PM') {
    if (time[0] != '12') {
      time[0] = (parseInt(time[0], 10) + 12).toString();
    }
  } else {
    if (time[0] != '12') {
      padTo2Digits(parseInt(time[0], 10));
    } else {
      time[0] = '00';
    }
  }
  return (
    [
      date.getFullYear().toString().substring(2),
      padTo2Digits(date.getMonth() + 1),
      padTo2Digits(date.getDate()),
    ].join('') +
    '_' +
    [time[0], time[1], time[2]].join('') +
    Math.floor(Math.random() * 1000)
  );
};
const mapZaloPayReqDto = (
  user_id: string,
  items: ItemDto[],
  config: any
): ZPCreateOrderReqDto => {
  const now: number = Date.now();
  const trans_id = getTransId();
  const amount = totalPrice(items);
  const hmacinput = [
    config.app_id,
    trans_id,
    user_id,
    amount,
    now,
    JSON.stringify({}),
    JSON.stringify(items),
  ].join('|');
  const mac: string = createHmac('sha256', config.key1)
    .update(hmacinput)
    .digest('hex');
  const res: ZPCreateOrderReqDto = {
    amount: amount,
    app_id: config.app_id,
    app_time: now,
    app_user: user_id,
    item: JSON.stringify(items),
    app_trans_id: trans_id,
    bank_code: '',
    callback_url: config.callback_URL,
    description: `Megoo - Paymemt for the order #${trans_id}`,
    embed_data: JSON.stringify({}),
    mac: mac,
  };
  return res;
};
const mapZPGetStatusReqDto = (
  app_id: string,
  app_trans_id: string,
  config: any
): ZPGetOrderStatusReqDto => {
  const hmacinput = [app_id, app_trans_id, config.key1].join('|');
  const mac: string = createHmac('sha256', config.key1)
    .update(hmacinput)
    .digest('hex');
  return {
    app_id: app_id,
    app_trans_id: app_trans_id,
    mac: mac,
  };
};
