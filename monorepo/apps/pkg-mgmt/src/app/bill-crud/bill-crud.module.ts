import { Module, forwardRef } from '@nestjs/common';
import { BillCrudService } from './bill-crud.service';
import { BillCrudController } from './bill-crud.controller';
import { GrCrudModule } from '../gr-crud/gr-crud.module';
import { Bill, BillSchema } from '../../schemas/billing.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Group, GroupSchema } from '../../schemas/group.schema';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Package, PackageSchema } from '../../schemas/package.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Group.name, schema: GroupSchema }]),
    MongooseModule.forFeature([{ name: Bill.name, schema: BillSchema }]),
    MongooseModule.forFeature([{ name: Package.name, schema: PackageSchema }]),
    ClientsModule.register([
      {
        name: 'USERS_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'users' + 'bill-crud' + 'users',
            brokers: [`${process.env.KAFKA_HOST}:${process.env.KAFKA_PORT}`],
          },
          consumer: {
            groupId: 'users-consumer' + 'bill-crud' + 'users',
          },
        },
      },
      {
        name: 'PROD_MGMT_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'prod-mgmt' + 'gr-crud' + 'prod-mgmt',
            brokers: [`${process.env.KAFKA_HOST}:${process.env.KAFKA_PORT}`],
          },
          consumer: {
            groupId: 'prod-mgmt-consumer' + 'gr-crud' + 'prod-mgmt',
          },
        },
      },
    ]),
    forwardRef(() => GrCrudModule),
  ],
  controllers: [BillCrudController],
  providers: [BillCrudService],
  exports: [BillCrudService],
})
export class BillCrudModule {}
