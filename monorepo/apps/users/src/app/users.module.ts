import { Module } from '@nestjs/common';
import { DataBaseModule } from '../core/database/database.module';
import { UsersCrudModule } from './users-crud/users-crud.module';

import { AppController } from './users.controller';
import { AppService } from './users.service';
import { SeederModule } from '../core/seeder/seeder';

@Module({
  imports: [UsersCrudModule, DataBaseModule, SeederModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
