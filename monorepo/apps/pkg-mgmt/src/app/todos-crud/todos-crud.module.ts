import { Module } from '@nestjs/common';
import { TodosCrudService } from './todos-crud.service';
import { TodosCrudController } from './todos-crud.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { Group, GroupSchema } from '../../schemas/group.schema';
import {
  Todo,
  TodoList,
  TodoListSchema,
  TodoSchema,
} from '../../schemas/todos.schema';
import { BillCrudModule } from '../bill-crud/bill-crud.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Group.name, schema: GroupSchema },
      { name: TodoList.name, schema: TodoListSchema },
      { name: Todo.name, schema: TodoSchema },
    ]),
    ClientsModule.register([
      {
        name: 'USERS_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'users' + 'todo-crud' + 'users',
            brokers: [`${process.env.KAFKA_HOST}:${process.env.KAFKA_PORT}`],
          },
          consumer: {
            groupId: 'users-consumer' + 'todo-crud' + 'users',
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
  ],
  controllers: [TodosCrudController],
  providers: [TodosCrudService],
  exports: [TodosCrudService],
})
export class TodosCrudModule {}
