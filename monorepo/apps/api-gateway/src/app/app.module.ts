import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { randomUUID } from 'crypto';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PkgMgmtModule } from './pkg-mgmt/pkg-mgmt.module';
import { FileModule } from './file/file.module';
import { TxnModule } from './txn/txn.module';

import * as dotenv from 'dotenv';
import { ENV_FILE } from '@nyp19vp-be/shared';
import { ProdMgmtModule } from './prod-mgmt/prod-mgmt.module';
import { DivisionsModule } from './divisions/divisions.module';
dotenv.config({
  path: process.env.NODE_ENV !== 'dev' ? process.env.ENV_FILE : ENV_FILE.DEV,
});

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'auth',
            brokers: [`${process.env.KAFKA_HOST}:${process.env.KAFKA_PORT}`],
          },
          consumer: {
            groupId: 'auth-consumer' + randomUUID(),
          },
        },
      },
      {
        name: 'USERS_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'users',
            brokers: [`${process.env.KAFKA_HOST}:${process.env.KAFKA_PORT}`],
          },
          consumer: {
            groupId: 'users-consumer' + randomUUID(),
          },
        },
      },
    ]),
    AuthModule,
    UsersModule,
    PkgMgmtModule,
    FileModule,
    TxnModule,
    ProdMgmtModule,
    DivisionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
