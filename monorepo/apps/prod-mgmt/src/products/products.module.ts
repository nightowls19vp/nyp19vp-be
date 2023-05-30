import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupProductEntity } from '../entities/group-product.entity';
import { GroupEntity } from '../entities/group.entity';
import { ItemEntity } from '../entities/item.entity';
import { ProductEntity } from '../entities/product.entity';
import { PurchaseLocationEntity } from '../entities/purchase-location.entity';
import { StorageLocationEntity } from '../entities/storage-location.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      GroupEntity,
      ProductEntity,
      GroupProductEntity,
      PurchaseLocationEntity,
      StorageLocationEntity,
      ItemEntity,
    ]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
