import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { GroupProductsModule } from './group-products/group-products.module';
import { GroupsModule } from './groups/groups.module';
import { ItemsModule } from './items/items.module';
import { LocationsModule } from './locations/locations.module';
import { LocationsService } from './locations/locations.service';
import { ProdMgmtController } from './prod-mgmt.controller';
import { ProdMgmtService } from './prod-mgmt.service';
import { ProductsModule } from './products/products.module';
import { ProductsService } from './products/products.service';

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
    GroupsModule,
    ProductsModule,
    GroupProductsModule,
    ItemsModule,
    LocationsModule,
  ],
  controllers: [ProdMgmtController],
  providers: [ProdMgmtService, ProductsService, LocationsService],
})
export class ProdMgmtModule {}
