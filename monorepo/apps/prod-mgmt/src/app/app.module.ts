import { Module } from '@nestjs/common';

import { DataBaseModule } from '../core/database/database.module';
import { DivisionsModule } from '../divisions/divisions.module';
import { GroupsProductsModule } from '../groups-products/groups-products.module';
import { GroupsModule } from '../groups/groups.module';
import { ItemsModule } from '../items/items.module';
import { PurchaseLocationsModule } from '../purchase-locations/purchase-locations.module';
import { ProductsModule } from '../products/products.module';
import { StorageLocationsModule } from '../storage-locations/storage-locations.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    DataBaseModule,
    GroupsModule,
    ProductsModule,
    GroupsProductsModule,
    ItemsModule,
    DivisionsModule,
    PurchaseLocationsModule,
    StorageLocationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
