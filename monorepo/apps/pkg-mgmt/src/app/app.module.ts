import { Module } from '@nestjs/common';
import { DataBaseModule } from '../core/database/database.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PkgCrudModule } from './pkg-crud/pkg-crud.module';
import { GrCrudModule } from './gr-crud/gr-crud.module';
import { InitDbModule } from '../core/init-db/init-db.module';
import { BillCrudModule } from './bill-crud/bill-crud.module';

@Module({
  imports: [PkgCrudModule, DataBaseModule, GrCrudModule, InitDbModule, BillCrudModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
