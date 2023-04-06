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
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataBaseModule } from '../core/database/database.module';
import { AccountService } from './services/account.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { JwtModule } from '@nestjs/jwt';
import { DbModule } from './db/db.module';
import { SocialAccountEntity } from './entities/social-media-account.entity';
import { ENV_FILE } from '@nyp19vp-be/shared';
import { join } from 'path';

import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => {
        return {
          transport: {
            host: config.get('MAIL_HOST'),
            secure: config.get('NODE_ENV') !== ENV_FILE.DEV,
            auth: {
              user: config.get('MAIL_USER'),
              pass: config.get('MAIL_PASSWORD'),
            },
            tls: {
              rejectUnauthorized: config.get('NODE_ENV') === ENV_FILE.DEV,
            },
          },
          defaults: {
            from: config.get('MAIL_FROM'),
          },
          template: {
            dir: join(__dirname, 'templates/email'),
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
          },
        };
      },
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV !== 'dev' ? process.env.ENV_FILE : ENV_FILE.DEV,
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
    JwtModule,
    TypeOrmModule.forFeature([
      AccountEntity,
      SocialAccountEntity,
      StatusEntity,
      RoleEntity,
      ActionEntity,
      RefreshTokenBlacklistEntity,
    ]),
    DbModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AccountService,
    RoleService,
    ActionService,
    RefreshTokenBlacklistService,
  ],
  exports: [
    AuthService,
    AccountService,
    RoleService,
    ActionService,
    RefreshTokenBlacklistService,
  ],
})
export class AuthModule {}
