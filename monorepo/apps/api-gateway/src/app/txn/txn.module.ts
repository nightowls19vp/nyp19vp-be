import { Module } from '@nestjs/common';
import { TxnService } from './txn.service';
import { TxnController } from './txn.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { randomUUID } from 'crypto';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'TXN_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'txn',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'txn-consumer',
          },
        },
      },
    ]),
  ],
  controllers: [TxnController],
  providers: [TxnService],
})
export class TxnModule {}
