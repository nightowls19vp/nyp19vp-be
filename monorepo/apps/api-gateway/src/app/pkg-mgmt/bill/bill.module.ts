import { Module } from '@nestjs/common';
import { BillService } from './bill.service';
import { BillController } from './bill.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'PKG_MGMT_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'pkg-mgmt' + 'api-gateway' + 'bill',
            brokers: [`${process.env.KAFKA_HOST}:${process.env.KAFKA_PORT}`],
          },
          consumer: {
            groupId: 'pkg-mgmt-consumer' + 'api-gateway' + 'bill',
          },
        },
      },
    ]),
  ],
  controllers: [BillController],
  providers: [BillService],
})
export class BillModule {}
