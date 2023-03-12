import { randomUUID } from 'crypto';
import { StatusEntity } from './entities/status.entity';
import { RefreshTokenBlacklistEntity } from './entities/refresh-token-blacklist.entity';
import { ActionEntity } from './entities/action.entity';
import { RoleEntity } from './entities/role.entity';
import { AccountEntity } from './entities/account.entity';
import { RefreshTokenBlacklistService } from './services/refresh-token-blacklist.service';
import { ActionService } from './services/action.service';
import { RoleService } from './services/role.service';
import { Global, Module } from '@nestjs/common';

import { AuthController } from './controller/auth.controller';
import { AuthService } from './services/auth.service';
import { CONST } from '@nyp19vp-be/shared';
import { ConfigModule } from '@nestjs/config';
import { DataBaseModule } from '../core/database/database.module';
import { AccountService } from './services/account.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV !== 'dev'
          ? process.env.ENV_FILE
          : CONST.ENV_FILE.DEV,
    }),
    ClientsModule.register([
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
    DataBaseModule,
    TypeOrmModule.forFeature([
      AccountEntity,
      StatusEntity,
      RoleEntity,
      ActionEntity,
      RefreshTokenBlacklistEntity,
    ]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AccountService,
    RoleService,
    ActionService,
    RefreshTokenBlacklistService,
  ],
})
export class AuthModule {}
