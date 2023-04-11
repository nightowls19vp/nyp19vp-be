import { Module } from '@nestjs/common';
import { TxnCrudService } from './txn-crud.service';
import { TxnCrudController } from './txn-crud.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { randomUUID } from 'crypto';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { zpconfig } from '../../core/config/zalopay.config';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        timeout: configService.get('HTTP_TIMEOUT'),
        maxRedirects: configService.get('HTTP_MAX_REDIRECTS'),
      }),
      inject: [ConfigService],
    }),
    ClientsModule.register([
      {
        name: 'PKG_MGMT_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'pkg-mgmt',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'pkg-mgmt-consumer' + randomUUID(), // FIXME,
          },
        },
      },
    ]),
  ],
  controllers: [TxnCrudController],
  providers: [
    TxnCrudService,
    { provide: 'ZALOPAY_CONFIG', useValue: zpconfig },
  ],
})
export class TxnCrudModule {}
