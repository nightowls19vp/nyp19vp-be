import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  OnModuleInit,
  RequestTimeoutException,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import {
  BaseResDto,
  CreateBillReqDto,
  GetBillResDto,
  UpdateBillReqDto,
  UpdateBillSttReqDto,
  kafkaTopic,
} from '@nyp19vp-be/shared';
import { Types } from 'mongoose';
import { catchError, firstValueFrom, timeout } from 'rxjs';
import { SocketGateway } from '../../socket/socket.gateway';

@Injectable()
export class BillService implements OnModuleInit {
  constructor(
    @Inject('PKG_MGMT_SERVICE') private readonly packageMgmtClient: ClientKafka,
    private readonly socketGateway: SocketGateway,
  ) {}

  onModuleInit() {
    const billTopics = Object.values(kafkaTopic.PKG_MGMT.EXTENSION.BILL);

    for (const topic of billTopics) {
      this.packageMgmtClient.subscribeToResponseOf(topic);
    }
  }

  async create(createBillReqDto: CreateBillReqDto): Promise<BaseResDto> {
    return await firstValueFrom(
      this.packageMgmtClient
        .send(
          kafkaTopic.PKG_MGMT.EXTENSION.BILL.CREATE,
          JSON.stringify(createBillReqDto),
        )
        .pipe(
          timeout(5000),
          catchError(() => {
            throw new RequestTimeoutException();
          }),
        ),
    ).then(async (res) => {
      if (res.statusCode == HttpStatus.CREATED) {
        const list_id = createBillReqDto.borrowers.map((borrower) => {
          return borrower.borrower;
        });
        list_id.push(createBillReqDto.lender);
        const noti = list_id.map(async (user_id) => {
          await this.socketGateway.handleEvent(
            'createdBill',
            user_id,
            res.data,
          );
        });
        await Promise.all(noti);
        return res;
      } else {
        throw new HttpException(res.message, res.statusCode, {
          cause: new Error(res.error),
          description: res.error,
        });
      }
    });
  }
  async findById(id: Types.ObjectId): Promise<GetBillResDto> {
    return await firstValueFrom(
      this.packageMgmtClient
        .send(kafkaTopic.PKG_MGMT.EXTENSION.BILL.GET_BY_ID, id)
        .pipe(
          timeout(5000),
          catchError(() => {
            throw new RequestTimeoutException();
          }),
        ),
    ).then((res) => {
      if (res.statusCode == HttpStatus.OK) {
        return res;
      } else {
        throw new HttpException(res.message, res.statusCode, {
          cause: new Error(res.error),
          description: res.error,
        });
      }
    });
  }
  async update(updateBillReqDto: UpdateBillReqDto): Promise<BaseResDto> {
    return await firstValueFrom(
      this.packageMgmtClient
        .send(
          kafkaTopic.PKG_MGMT.EXTENSION.BILL.UPDATE,
          JSON.stringify(updateBillReqDto),
        )
        .pipe(
          timeout(5000),
          catchError(() => {
            throw new RequestTimeoutException();
          }),
        ),
    ).then(async (res) => {
      if (res.statusCode == HttpStatus.OK) {
        const list_id = updateBillReqDto.borrowers.map((borrower) => {
          return borrower.borrower;
        });
        list_id.push(updateBillReqDto.lender);
        const noti = list_id.map(async (user_id) => {
          await this.socketGateway.handleEvent(
            'updatedBill',
            user_id,
            res.data,
          );
        });
        await Promise.all(noti);
        return res;
      } else {
        throw new HttpException(res.message, res.statusCode, {
          cause: new Error(res.error),
          description: res.error,
        });
      }
    });
  }
  async updateStt(
    updateBillSttReqDto: UpdateBillSttReqDto,
  ): Promise<BaseResDto> {
    return await firstValueFrom(
      this.packageMgmtClient
        .send(
          kafkaTopic.PKG_MGMT.EXTENSION.BILL.UPDATE_STT,
          JSON.stringify(updateBillSttReqDto),
        )
        .pipe(
          timeout(5000),
          catchError(() => {
            throw new RequestTimeoutException();
          }),
        ),
    ).then(async (res) => {
      if (res.statusCode == HttpStatus.OK) {
        const list_id = updateBillSttReqDto.borrowers.map((borrower) => {
          return borrower.borrower;
        });
        const noti = list_id.map(async (user_id) => {
          await this.socketGateway.handleEvent(
            'updatedBill',
            user_id,
            res.data,
          );
        });
        await Promise.all(noti);
        return res;
      } else {
        throw new HttpException(res.message, res.statusCode, {
          cause: new Error(res.error),
          description: res.error,
        });
      }
    });
  }
  async remove(id: Types.ObjectId): Promise<BaseResDto> {
    return await firstValueFrom(
      this.packageMgmtClient
        .send(kafkaTopic.PKG_MGMT.EXTENSION.BILL.DELETE, id)
        .pipe(
          timeout(5000),
          catchError(() => {
            throw new RequestTimeoutException();
          }),
        ),
    ).then((res) => {
      if (res.statusCode == HttpStatus.OK) {
        return res;
      } else {
        throw new HttpException(res.message, res.statusCode, {
          cause: new Error(res.error),
          description: res.error,
        });
      }
    });
  }
  async restore(id: Types.ObjectId): Promise<BaseResDto> {
    return await firstValueFrom(
      this.packageMgmtClient
        .send(kafkaTopic.PKG_MGMT.EXTENSION.BILL.RESTORE, id)
        .pipe(
          timeout(5000),
          catchError(() => {
            throw new RequestTimeoutException();
          }),
        ),
    ).then((res) => {
      if (res.statusCode == HttpStatus.OK) {
        return res;
      } else {
        throw new HttpException(res.message, res.statusCode, {
          cause: new Error(res.error),
          description: res.error,
        });
      }
    });
  }
}
