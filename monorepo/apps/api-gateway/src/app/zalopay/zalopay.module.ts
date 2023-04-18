import { Module } from '@nestjs/common';
import { ZalopayService } from './zalopay.service';
import { ZalopayController } from './zalopay.controller';
import { zpconfig } from '../core/config/zalopay.config';
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
            groupId: 'txn-consumer' + randomUUID(), // FIXME,
          },
        },
      },
    ]),
  ],
  controllers: [ZalopayController],
  providers: [
    ZalopayService,
    { provide: 'ZALOPAY_CONFIG', useValue: zpconfig },
  ],
})
export class ZalopayModule {}
