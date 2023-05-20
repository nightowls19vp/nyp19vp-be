import { Module } from '@nestjs/common';
import { UsersCrudService } from './users-crud.service';
import { UsersCrudController } from './users-crud.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../../schemas/users.schema';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { randomUUID } from 'crypto';

import * as dotenv from 'dotenv';
import { ENV_FILE } from '@nyp19vp-be/shared';
dotenv.config({
  path: process.env.NODE_ENV !== 'dev' ? process.env.ENV_FILE : ENV_FILE.DEV,
});

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ClientsModule.register([
      {
        name: 'TXN_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'txn',
            brokers: [`${process.env.KAFKA_HOST}:${process.env.KAFKA_PORT}`],
          },
          consumer: {
            groupId: 'txn-consumer' + randomUUID(), // FIXME,
          },
        },
      },
    ]),
    ClientsModule.register([
      {
        name: 'PKG_MGMT_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'pkg-mgmt',
            brokers: [`${process.env.KAFKA_HOST}:${process.env.KAFKA_PORT}`],
          },
          consumer: {
            groupId: 'pkg-mgmt-consumer' + randomUUID(), // FIXME,
          },
        },
      },
    ]),
  ],
  controllers: [UsersCrudController],
  providers: [UsersCrudService],
})
export class UsersCrudModule {}
