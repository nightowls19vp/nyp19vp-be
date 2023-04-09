import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import {
  ItemDto,
  Items,
  PackageDto,
  UpdateCartReqDto,
  kafkaTopic,
  ZalopayReqDto,
  ZalopayResDto,
} from '@nyp19vp-be/shared';
import { Observable, catchError, from, of, timeout } from 'rxjs';
import { ClientKafka } from '@nestjs/microservices';
import { createHmac } from 'crypto';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';

@Injectable()
export class TxnCrudService implements OnModuleInit {
  constructor(
    private httpService: HttpService,
    @Inject('PKG_MGMT_SERVICE') private readonly pkgMgmtClient: ClientKafka
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
        const zaloPayReq = mapZaloPayReqDto(_id, mapPkgDtoToItemDto(res, cart));
        console.log(zaloPayReq);
        const zaloRes = await this.createOrder(zaloPayReq);
        console.log(zaloRes);
      });
  }

  createOrder(
    zalopayReqDto: ZalopayReqDto
  ): Observable<AxiosResponse<ZalopayResDto[]>> {
    return this.httpService.post(
      'https://sb-openapi.zalopay.vn/v2/create',
      zalopayReqDto
    );
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
  if (time[3] == 'PM') time[0] = (parseInt(time[0], 10) + 12).toString();
  else padTo2Digits(parseInt(time[0], 10));
  return (
    [
      date.getFullYear().toString().substring(2),
      padTo2Digits(date.getMonth() + 1),
      padTo2Digits(date.getDate()),
    ].join('') +
    '_' +
    [time[0], time[1], time[2]].join('')
  );
};
const mapZaloPayReqDto = (user_id: string, items: ItemDto[]): ZalopayReqDto => {
  const now: number = Date.now();
  const trans_id = getTransId();
  const key1 = 'PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL';
  const amount = totalPrice(items);
  const hmacinput = [2553, trans_id, user_id, amount, now, {}, items].join('|');
  const mac: string = createHmac('sha256', key1)
    .update(hmacinput)
    .digest('hex');
  const res: ZalopayReqDto = {
    amount: amount,
    app_id: 2553,
    app_time: now,
    app_user: user_id,
    item: items,
    app_trans_id: trans_id,
    description: `Megoo - Paymemt for the order #${trans_id}`,
    embed_data: {},
    key1: key1,
    mac: mac,
  };
  return res;
};
