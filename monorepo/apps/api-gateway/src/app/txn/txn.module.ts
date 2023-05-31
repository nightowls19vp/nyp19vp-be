import { Module } from '@nestjs/common';
import { TxnService } from './txn.service';
import { TxnController } from './txn.controller';
import { zpconfig } from '../core/config/zalopay.config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { randomUUID } from 'crypto';

import * as dotenv from 'dotenv';
import { ENV_FILE } from '@nyp19vp-be/shared';
import { SocketModule } from '../socket/socket.module';
import { CommModule } from '../comm/comm.module';
import { SocketGateway } from '../socket/socket.gateway';
import { SocketService } from '../socket/socket.service';
dotenv.config({
  path: process.env.NODE_ENV !== 'dev' ? process.env.ENV_FILE : ENV_FILE.DEV,
});

@Module({
  imports: [
    SocketModule,
    CommModule,
    ClientsModule.register([
      {
        name: 'TXN_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'txn',
            brokers: [`${process.env.KAFKA_HOST}:${process.env.KAFKA_PORT}`],
          },
          consumer: {
            groupId: 'txn-consumer' + randomUUID(), // FIXME,
          },
        },
      },
    ]),
  ],
  controllers: [TxnController],
  providers: [
    TxnService,
    { provide: 'ZALOPAY_CONFIG', useValue: zpconfig },
    SocketGateway,
    SocketService,
  ],
})
export class TxnModule {}
