import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TxnCrudModule } from './txn-crud/txn-crud.module';

@Module({
  imports: [TxnCrudModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
