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

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'auth',
            brokers: ['localhost:9092'],
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
            brokers: ['localhost:9092'],
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
