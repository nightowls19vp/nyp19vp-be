import { Module } from '@nestjs/common';
import { UsersCrudService } from './users-crud.service';
import { UsersCrudController } from './users-crud.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../../schemas/users.schema';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { randomUUID } from 'crypto';

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
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'txn-consumer' + randomUUID(), // FIXME,
          },
        },
      },
    ]),
  ],
  controllers: [UsersCrudController],
  providers: [UsersCrudService],
})
export class UsersCrudModule {}
