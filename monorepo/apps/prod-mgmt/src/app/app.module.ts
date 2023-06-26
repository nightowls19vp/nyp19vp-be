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
import { DbInitService } from './db-init/db-init.service';
import { ProductsService } from '../products/products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupProductEntity } from '../entities/group-product.entity';
import { GroupEntity } from '../entities/group.entity';
import { ItemEntity } from '../entities/item.entity';
import { ProductEntity } from '../entities/product.entity';
import { PurchaseLocationEntity } from '../entities/purchase-location.entity';
import { StorageLocationEntity } from '../entities/storage-location.entity';
import { ProvinceEntity } from '../entities/province.entity';
import { DistrictEntity } from '../entities/district.entity';
import { WardEntity } from '../entities/ward.entity';
import { ProvinceService } from '../divisions/province/province.service';
import { DistrictService } from '../divisions/district/district.service';
import { WardService } from '../divisions/ward/ward.service';

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

    TypeOrmModule.forFeature([
      GroupEntity,
      ProductEntity,
      GroupProductEntity,
      PurchaseLocationEntity,
      StorageLocationEntity,
      ItemEntity,
      ProvinceEntity,
      DistrictEntity,
      WardEntity,
    ]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    DbInitService,
    ProductsService,
    ProvinceService,
    DistrictService,
    WardService,
  ],
})
export class AppModule {}
