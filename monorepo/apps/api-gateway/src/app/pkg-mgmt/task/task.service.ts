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
  CreateTaskReqDto,
  UpdateTaskReqDto,
  UpdateTaskStateReqDto,
  kafkaTopic,
} from '@nyp19vp-be/shared';
import { SocketGateway } from '../../socket/socket.gateway';
import { catchError, firstValueFrom, timeout } from 'rxjs';
import { Types } from 'mongoose';
import { CronService } from './cron/cron.service';

@Injectable()
export class TaskService implements OnModuleInit {
  constructor(
    @Inject('PKG_MGMT_SERVICE') private readonly packageMgmtClient: ClientKafka,
    private readonly socketGateway: SocketGateway,
    private readonly cronService: CronService,
  ) {}
  onModuleInit() {
    const taskTopics = Object.values(kafkaTopic.PKG_MGMT.EXTENSION.TASK);

    for (const topic of taskTopics) {
      this.packageMgmtClient.subscribeToResponseOf(topic);
    }

    this.packageMgmtClient.subscribeToResponseOf(
      kafkaTopic.PKG_MGMT.GROUP.GET_BY_ID,
    );
  }

  async create(createTaskReqDto: CreateTaskReqDto): Promise<BaseResDto> {
    return await firstValueFrom(
      this.packageMgmtClient
        .send(
          kafkaTopic.PKG_MGMT.EXTENSION.TASK.CREATE,
          JSON.stringify(createTaskReqDto),
        )
        .pipe(
          timeout(5000),
          catchError(() => {
            throw new RequestTimeoutException();
          }),
        ),
    ).then(async (res) => {
      if (res.statusCode == HttpStatus.CREATED) {
        // if (createTaskReqDto.state == 'Public') {
        //   const projectionParams: ProjectionParams = {
        //     _id: createTodosReqDto._id,
        //     proj: { members: true },
        //   };
        //   const members = await firstValueFrom(
        //     this.packageMgmtClient.send(
        //       kafkaTopic.PKG_MGMT.GROUP.GET_BY_ID,
        //       projectionParams,
        //     ),
        //   );
        //   const noti = members.group.members.map(async (member) => {
        //     await this.socketGateway.handleEvent(
        //       'createdTodos',
        //       member.user._id,
        //       res.data,
        //     );
        //   });
        //   await Promise.all(noti);
        // }
        return res;
      } else {
        throw new HttpException(res.message, res.statusCode);
      }
    });
  }
  async update(updateTaskReqDto: UpdateTaskReqDto): Promise<BaseResDto> {
    return await firstValueFrom(
      this.packageMgmtClient
        .send(kafkaTopic.PKG_MGMT.EXTENSION.TASK.UPDATE, updateTaskReqDto)
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
        throw new HttpException(res.message, res.statusCode);
      }
    });
  }
  async updateState(
    updateTaskStateReqDto: UpdateTaskStateReqDto,
  ): Promise<BaseResDto> {
    return await firstValueFrom(
      this.packageMgmtClient
        .send(
          kafkaTopic.PKG_MGMT.EXTENSION.TASK.UPDATE_STATE,
          updateTaskStateReqDto,
        )
        .pipe(
          timeout(5000),
          catchError(() => {
            throw new RequestTimeoutException();
          }),
        ),
    ).then((res) => {
      if (res.statusCode == HttpStatus.OK) {
        const hours = res.data.startDate.getHours();
        const minutes = res.data.startDate.getMinutes();
        const date = res.data.startDate.getDate();
        const month = res.data.startDate.getMonth();
        // this.cronService.scheduleCron(
        //   res.data._id,
        //   minutes,
        //   hours,
        //   date,
        //   month,
        //   '*',
        // );
        return res;
      } else {
        throw new HttpException(res.message, res.statusCode);
      }
    });
  }
  async remove(id: Types.ObjectId): Promise<BaseResDto> {
    return await firstValueFrom(
      this.packageMgmtClient
        .send(kafkaTopic.PKG_MGMT.EXTENSION.TASK.DELETE, id)
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
        throw new HttpException(res.message, res.statusCode);
      }
    });
  }
  async restore(id: Types.ObjectId): Promise<BaseResDto> {
    return await firstValueFrom(
      this.packageMgmtClient
        .send(kafkaTopic.PKG_MGMT.EXTENSION.TASK.RESTORE, id)
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
        throw new HttpException(res.message, res.statusCode);
      }
    });
  }
  async findById(id: Types.ObjectId): Promise<BaseResDto> {
    return await firstValueFrom(
      this.packageMgmtClient
        .send(kafkaTopic.PKG_MGMT.EXTENSION.TASK.GET_BY_ID, id)
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
        throw new HttpException(res.message, res.statusCode);
      }
    });
  }
  callback(jobName: string) {
    console.log(jobName);
  }
}
