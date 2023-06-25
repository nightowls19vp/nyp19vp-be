import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { GroupProductsModule } from './group-products/group-products.module';
import { GroupsModule } from './groups/groups.module';
import { ItemsModule } from './items/items.module';
import { ProdMgmtController } from './prod-mgmt.controller';
import { ProdMgmtService } from './prod-mgmt.service';
import { ProductsModule } from './products/products.module';
import { ProductsService } from './products/products.service';
import { PurchaseLocationsModule } from './purchase-locations/purchase-locations.module';
import { PurchaseLocationsService } from './purchase-locations/purchase-locations.service';
import { StorageLocationsModule } from './storage-locations/storage-locations.module';
import { StorageLocationsService } from './storage-locations/storage-locations.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'PROD_MGMT_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'prod-mgmt' + 'api-gateway' + 'app',
            brokers: [`${process.env.KAFKA_HOST}:${process.env.KAFKA_PORT}`],
          },
          consumer: {
            groupId: 'prod-mgmt' + 'api-gateway' + 'app',
          },
        },
      },
    ]),
    GroupsModule,
    ProductsModule,
    GroupProductsModule,
    ItemsModule,
    PurchaseLocationsModule,
    StorageLocationsModule,
  ],
  controllers: [ProdMgmtController],
  providers: [
    ProdMgmtService,
    ProductsService,
    PurchaseLocationsService,
    StorageLocationsService,
  ],
})
export class ProdMgmtModule {}
