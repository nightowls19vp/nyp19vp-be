import { Module } from '@nestjs/common';
import { GrCrudService } from './gr-crud.service';
import { GrCrudController } from './gr-crud.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Group, GroupSchema } from '../../schemas/group.schema';
import { Package, PackageSchema } from '../../schemas/package.schema';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Bill, BillSchema } from '../../schemas/billing.schema';
import { BillCrudModule } from '../bill-crud/bill-crud.module';
import { TodosCrudModule } from '../todos-crud/todos-crud.module';
import {
  Todo,
  TodoList,
  TodoListSchema,
  TodoSchema,
} from '../../schemas/todos.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Group.name, schema: GroupSchema },
      { name: Bill.name, schema: BillSchema },
      { name: Package.name, schema: PackageSchema },
      { name: TodoList.name, schema: TodoListSchema },
      { name: Todo.name, schema: TodoSchema },
    ]),
    ClientsModule.register([
      {
        name: 'USERS_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'users' + 'gr-crud' + 'users',
            brokers: [`${process.env.KAFKA_HOST}:${process.env.KAFKA_PORT}`],
          },
          consumer: {
            groupId: 'users-consumer' + 'gr-crud' + 'users',
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
    BillCrudModule,
    TodosCrudModule,
  ],
  controllers: [GrCrudController],
  providers: [GrCrudService],
  exports: [GrCrudService],
})
export class GrCrudModule {}
