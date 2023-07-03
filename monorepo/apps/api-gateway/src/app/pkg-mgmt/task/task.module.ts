import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { CronService } from './cron/cron.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SocketModule } from '../../socket/socket.module';
import { CommModule } from '../../comm/comm.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ClientsModule.register([
      {
        name: 'PKG_MGMT_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'pkg-mgmt' + 'api-gateway' + 'task',
            brokers: [`${process.env.KAFKA_HOST}:${process.env.KAFKA_PORT}`],
          },
          consumer: {
            groupId: 'pkg-mgmt-consumer' + 'api-gateway' + 'task',
          },
        },
      },
    ]),
    SocketModule,
    CommModule,
  ],
  controllers: [TaskController],
  providers: [TaskService, CronService],
})
export class TaskModule {}
