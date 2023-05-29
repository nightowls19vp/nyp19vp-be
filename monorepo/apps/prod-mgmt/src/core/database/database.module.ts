import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbCfg } from './database.config';
import { GroupProductEntity } from '../../entities/group-product.entity';
import { GroupEntity } from '../../entities/group.entity';
import { ItemEntity } from '../../entities/item.entity';
import { ProductEntity } from '../../entities/product.entity';
import { PurchaseLocationEntity } from '../../entities/purchase-location.entity';
import { StorageLocationEntity } from '../../entities/storage-location.entity';

console.log('dbCfg', dbCfg);

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: dbCfg.host,
      port: parseInt(dbCfg.port),
      username: dbCfg.username,
      password: dbCfg.password,
      database: dbCfg.database,
      entities: [
        GroupProductEntity,
        GroupEntity,
        ItemEntity,
        ProductEntity,
        PurchaseLocationEntity,
        StorageLocationEntity,
      ],
      autoLoadEntities: true,
      synchronize: dbCfg.synchronize,
      logging: dbCfg.logging,
    }),
  ],
})
export class DataBaseModule {}
