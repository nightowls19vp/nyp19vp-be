import {
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
  CreateTransReqDto,
  ZPDataCallback,
  UpdateTrxHistReqDto,
  EmbedData,
  CreateTransResDto,
  ZPCheckoutResDto,
} from '@nyp19vp-be/shared';
import { catchError, firstValueFrom, timeout } from 'rxjs';
import { ClientKafka } from '@nestjs/microservices';
import { createHmac } from 'crypto';
import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';
import { zpconfig } from '../../core/config/zalopay.config';
import { setIntervalAsync, clearIntervalAsync } from 'set-interval-async';
import { Transaction, TransactionDocument } from '../../schemas/txn.schema';
import mongoose from 'mongoose';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import * as MOP from '../../core/constants/payment_method.constants';
import { SoftDeleteModel } from 'mongoose-delete';

@Injectable()
export class TxnCrudService {
  constructor(
    private httpService: HttpService,
    @InjectModel(Transaction.name)
    private transModel: SoftDeleteModel<TransactionDocument>,
    @Inject('PKG_MGMT_SERVICE') private readonly pkgMgmtClient: ClientKafka,
    @Inject('USERS_SERVICE') private readonly usersClient: ClientKafka,
    @Inject('ZALOPAY_CONFIG') private readonly config: typeof zpconfig,
    @InjectConnection() private readonly connection: mongoose.Connection,
  ) {}

  async zpCheckout(
    updateCartReqDto: UpdateCartReqDto,
  ): Promise<ZPCheckoutResDto> {
    const { _id, cart } = updateCartReqDto;
    const list_id = cart.map((x) => x.package);
    try {
      const res = await firstValueFrom(
        this.pkgMgmtClient
          .send(kafkaTopic.PACKAGE_MGMT.GET_MANY_PKG, list_id)
          .pipe(timeout(5000)),
      );
      if (res.length) {
        const zaloPayReq = mapZaloPayReqDto(
          _id,
          mapPkgDtoToItemDto(res, cart),
          this.config,
        );
        console.log(zaloPayReq);
        const order = await this.zpCreateOrder(zaloPayReq);
        if (order.return_code == 1) {
          const trans = mapZPCreateOrderReqDtoToCreateTransReqDto(zaloPayReq);
          return Promise.resolve({
            statusCode: HttpStatus.OK,
            message: `Create order successfully`,
            order: order,
            trans: trans,
          });
        } else {
          return Promise.resolve({
            statusCode: HttpStatus.BAD_GATEWAY,
            message: `Create order failed`,
            order: order,
            trans: null,
          });
        }
      } else {
        return Promise.resolve({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Package have been removed',
          order: null,
          trans: null,
        });
      }
    } catch (error) {
      return Promise.resolve({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
        order: null,
        trans: null,
      });
    }
  }

  async zpGetStatus(
    createTransReqDto: CreateTransReqDto,
  ): Promise<CreateTransResDto> {
    const { _id, user } = createTransReqDto;
    const zpGetOrderStatusReqDto: ZPGetOrderStatusReqDto = mapZPGetStatusReqDto(
      _id,
      this.config,
    );
    const res = await this.zpCheckStatus(zpGetOrderStatusReqDto);
    console.log('result:', res);
    if (typeof res === 'string') {
      return Promise.resolve({
        statusCode: HttpStatus.REQUEST_TIMEOUT,
        message: `Request timeout`,
      });
    } else {
      let result: CreateTransResDto;
      const session = await this.connection.startSession();
      session.startTransaction();
      try {
        const newTrans = new this.transModel({
          _id: _id,
          user: user,
          amount: createTransReqDto.amount,
          item: createTransReqDto.item,
          method: {
            type: MOP.PAYMENT_METHOD.EWALLET,
            name: MOP.EWALLET.ZALOPAY,
          },
        });
        const trans = (await newTrans.save()).$session(session);
        if (!trans) {
          throw new NotFoundException();
        }
        const updateTrxHistReqDto = mapUpdateTrxHistReqDto(
          user,
          _id,
          createTransReqDto.item,
        );
        const res = await firstValueFrom(
          this.usersClient.send(
            kafkaTopic.USERS.UPDATE_TRX,
            updateTrxHistReqDto,
          ),
        );
        if (res.statusCode == HttpStatus.OK) {
          await session.commitTransaction();
          result = {
            statusCode: HttpStatus.OK,
            message: `Create Transaction #${_id} successfully`,
          };
        } else {
          await session.abortTransaction();
          result = {
            statusCode: res.statusCode,
            message: res.message,
          };
        }
      } catch (error) {
        await session.abortTransaction();
        result = {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message,
        };
      } finally {
        session.endSession();
        // eslint-disable-next-line no-unsafe-finally
        return Promise.resolve(result);
      }
    }
  }

  async zpCreateTrans(
    zpDataCallback: ZPDataCallback,
  ): Promise<CreateTransResDto> {
    let result: CreateTransResDto;
    const item: ItemDto[] = JSON.parse(zpDataCallback.item);
    const newTrans = new this.transModel({
      _id: zpDataCallback.app_trans_id,
      user: zpDataCallback.app_user,
      item: item,
      amount: zpDataCallback.amount,
      method: {
        type: MOP.PAYMENT_METHOD.EWALLET,
        name: MOP.EWALLET.ZALOPAY,
        trans_id: zpDataCallback.zp_trans_id,
        detail_info: {
          channel: MOP.ZALOPAY[zpDataCallback.channel],
          zp_user_id: zpDataCallback.merchant_user_id,
          user_fee_amount: zpDataCallback.user_fee_amount,
          discount_amount: zpDataCallback.discount_amount,
        },
      },
    });
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const trans = (await newTrans.save()).$session(session);
      if (!trans) {
        throw new NotFoundException();
      }
      const updateTrxHistReqDto = mapUpdateTrxHistReqDto(
        zpDataCallback.app_user,
        zpDataCallback.app_trans_id,
        item,
      );
      const res = await firstValueFrom(
        this.usersClient.send(kafkaTopic.USERS.UPDATE_TRX, updateTrxHistReqDto),
      );
      if (res.statusCode == HttpStatus.OK) {
        await session.commitTransaction();
        result = {
          statusCode: HttpStatus.OK,
          message: `Create Transaction #${zpDataCallback.app_trans_id} successfully`,
        };
      } else {
        await session.abortTransaction();
        result = {
          statusCode: res.statusCode,
          message: res.message,
        };
      }
    } catch (error) {
      await session.abortTransaction();
      result = {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      };
    } finally {
      session.endSession();
      // eslint-disable-next-line no-unsafe-finally
      return Promise.resolve(result);
    }
  }

  zpCheckStatus(
    zpGetOrderStatusReqDto: ZPGetOrderStatusReqDto,
  ): Promise<ZPGetOrderStatusResDto | string> {
    let timer;
    return new Promise((resolve) => {
      timer = setIntervalAsync(async () => {
        const res: ZPGetOrderStatusResDto = await this.zpGetOrderStatus(
          zpGetOrderStatusReqDto,
        );
        if (res.return_code == 1) {
          resolve(res);
          await clearIntervalAsync(timer);
        }
      }, 5000);
      setTimeout(async () => {
        resolve('Timeout');
        await clearIntervalAsync(timer);
      }, 15 * 60 * 1000);
    });
  }

  async zpCreateOrder(
    zalopayReqDto: ZPCreateOrderReqDto,
  ): Promise<ZPCreateOrderResDto> {
    const { data } = await firstValueFrom(
      this.httpService
        .post(this.config.create_order_endpoint, null, {
          params: zalopayReqDto,
        })
        .pipe(
          catchError((error: AxiosError) => {
            throw error.response.data;
          }),
        ),
    );
    return data;
  }

  async zpGetOrderStatus(
    zpGetOrderStatusReqDto: ZPGetOrderStatusReqDto,
  ): Promise<ZPGetOrderStatusResDto> {
    const { data } = await firstValueFrom(
      this.httpService
        .post(this.config.get_status_endpoint, null, {
          params: zpGetOrderStatusReqDto,
        })
        .pipe(
          catchError((error: AxiosError) => {
            throw error.response.data;
          }),
        ),
    );
    return data;
  }
}
function padTo2Digits(num: number) {
  return num.toString().padStart(2, '0');
}
const mapPkgDtoToItemDto = (
  listPkg: PackageDto[],
  cart: Items[],
): ItemDto[] => {
  let idx = 0;
  const ListItem: ItemDto[] = cart.map((i) => {
    const cost =
      listPkg.at(idx).duration >= 12
        ? (listPkg.at(idx).price +
            listPkg.at(idx).coefficient * (i.noOfMember - 2) * i.duration) *
          0.7
        : listPkg.at(idx).price +
          listPkg.at(idx).coefficient * (i.noOfMember - 2) * i.duration;
    const item: ItemDto = {
      id: i.package,
      name: listPkg.at(idx).name,
      price: listPkg.at(idx).coefficient ? cost : listPkg.at(idx).price,
      quantity: i.quantity,
      duration: i.duration ? i.duration : listPkg.at(idx).duration,
      noOfMember: i.noOfMember ? i.noOfMember : listPkg.at(idx).noOfMember,
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
  return total;
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
      time[0] = padTo2Digits(parseInt(time[0], 10));
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
  config: any,
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
  const embed_data: EmbedData = {
    redirecturl: 'https://www.youtube.com/',
  };
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
  app_trans_id: string,
  config: any,
): ZPGetOrderStatusReqDto => {
  const hmacinput = [config.app_id, app_trans_id, config.key1].join('|');
  const mac: string = createHmac('sha256', config.key1)
    .update(hmacinput)
    .digest('hex');
  return {
    app_id: config.app_id,
    app_trans_id: app_trans_id,
    mac: mac,
  };
};
const mapUpdateTrxHistReqDto = (
  app_user: string,
  app_trans_id: string,
  item: ItemDto[],
): UpdateTrxHistReqDto => {
  const updateTrxHistReqDto: UpdateTrxHistReqDto = {
    _id: app_user,
    trx: app_trans_id,
    cart: item.map((x) => {
      const item: Items = { package: x.id, quantity: x.quantity };
      return item;
    }),
  };
  return updateTrxHistReqDto;
};
const mapZPCreateOrderReqDtoToCreateTransReqDto = (
  zpCreateOrderReqDto: ZPCreateOrderReqDto,
): CreateTransReqDto => {
  const createTransReqDto: CreateTransReqDto = {
    _id: zpCreateOrderReqDto.app_trans_id,
    user: zpCreateOrderReqDto.app_user,
    item: JSON.parse(zpCreateOrderReqDto.item),
    amount: zpCreateOrderReqDto.amount,
  };
  return createTransReqDto;
};
