import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DataBaseModule } from '../core/database/database.module';
import { GroupsModule } from '../groups/groups.module';
import { ProductsModule } from '../products/products.module';
import { GroupsProductsModule } from '../groups-products/groups-products.module';
import { LocationsModule } from '../locations/locations.module';
import { ItemsModule } from '../items/items.module';
import { DivisionsModule } from '../divisions/divisions.module';

@Module({
  imports: [
    DataBaseModule,
    GroupsModule,
    ProductsModule,
    GroupsProductsModule,
    LocationsModule,
    ItemsModule,
    DivisionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
