import { Module } from '@nestjs/common';
import { DataBaseModule } from '../core/database/database.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PkgCrudModule } from './pkg-crud/pkg-crud.module';
import { GrCrudModule } from './gr-crud/gr-crud.module';

@Module({
  imports: [PkgCrudModule, DataBaseModule, GrCrudModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
