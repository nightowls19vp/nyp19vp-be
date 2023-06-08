import { Module } from '@nestjs/common';
import { PkgMgmtService } from './pkg-mgmt.service';
import { PkgMgmtController } from './pkg-mgmt.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { randomUUID } from 'crypto';

import * as dotenv from 'dotenv';
import { ENV_FILE } from '@nyp19vp-be/shared';
import { SocketGateway } from '../socket/socket.gateway';
import { SocketService } from '../socket/socket.service';
import { SocketModule } from '../socket/socket.module';
import { CommModule } from '../comm/comm.module';
dotenv.config({
  path: process.env.NODE_ENV !== 'dev' ? process.env.ENV_FILE : ENV_FILE.DEV,
});

@Module({
  imports: [
    SocketModule,
    CommModule,
    ClientsModule.register([
      {
        name: 'PKG_MGMT_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'pkg-mgmt',
            brokers: [`${process.env.KAFKA_HOST}:${process.env.KAFKA_PORT}`],
          },
          consumer: {
            groupId: 'pkg-mgmt-consumer' + randomUUID(), // FIXME,
          },
        },
      },
      {
        name: 'AUTH_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'auth',
            brokers: [`${process.env.KAFKA_HOST}:${process.env.KAFKA_PORT}`],
          },
          consumer: {
            groupId: 'auth-consumer' + randomUUID(),
          },
        },
      },
    ]),
  ],
  controllers: [PkgMgmtController],
  providers: [PkgMgmtService, SocketGateway, SocketService],
})
export class PkgMgmtModule {}
