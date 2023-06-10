import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'PROD_MGMT_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'prod-mgmt' + 'api-gateway' + 'prod-mgmt',
            brokers: [`${process.env.KAFKA_HOST}:${process.env.KAFKA_PORT}`],
          },
          consumer: {
            groupId: 'prod-mgmt' + 'api-gateway' + 'prod-mgmt',
          },
        },
      },
    ]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
