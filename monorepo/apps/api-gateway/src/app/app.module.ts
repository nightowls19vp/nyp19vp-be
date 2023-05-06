import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PkgMgmtModule } from './pkg-mgmt/pkg-mgmt.module';
import { TxnModule } from './txn/txn.module';

@Module({
  imports: [AuthModule, UsersModule, PkgMgmtModule, TxnModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
