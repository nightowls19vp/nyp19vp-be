import { Module } from '@nestjs/common';
import { ProdMgmtService } from './services/prod-mgmt.service';
import { ProdMgmtController } from './prod-mgmt.controller';
import { ProductService } from './services/products.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'PROD_MGMT_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'prod-mgmt',
            brokers: [`${process.env.KAFKA_HOST}:${process.env.KAFKA_PORT}`],
          },
          consumer: {
            groupId: 'prod-mgmt' + 'api-gateway', // FIXME,
          },
        },
      },
    ]),
  ],
  controllers: [ProdMgmtController],
  providers: [ProdMgmtService, ProductService],
})
export class ProdMgmtModule {}
