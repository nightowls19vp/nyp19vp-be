import { Module } from '@nestjs/common';
import { GrCrudService } from './gr-crud.service';
import { GrCrudController } from './gr-crud.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Group, GroupSchema } from '../../schemas/group.schema';
import { Package, PackageSchema } from '../../schemas/package.schema';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { randomUUID } from 'crypto';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Group.name, schema: GroupSchema }]),
    MongooseModule.forFeature([{ name: Package.name, schema: PackageSchema }]),
    ClientsModule.register([
      {
        name: 'USERS_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'users',
            brokers: [`${process.env.KAFKA_HOST}:${process.env.KAFKA_PORT}`],
          },
          consumer: {
            groupId: 'users-consumer' + randomUUID(), // FIXME,
          },
        },
      },
    ]),
  ],
  controllers: [GrCrudController],
  providers: [GrCrudService],
})
export class GrCrudModule {}
