import { Module } from '@nestjs/common';
import { TodosCrudService } from './todos-crud.service';
import { TodosCrudController } from './todos-crud.controller';
import { GrCrudModule } from '../gr-crud/gr-crud.module';
import { GrCrudService } from '../gr-crud/gr-crud.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { Package, PackageSchema } from '../../schemas/package.schema';
import { Group, GroupSchema } from '../../schemas/group.schema';
import { Todos, TodosSchema } from '../../schemas/todos.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Group.name, schema: GroupSchema }]),
    MongooseModule.forFeature([{ name: Todos.name, schema: TodosSchema }]),
    MongooseModule.forFeature([{ name: Package.name, schema: PackageSchema }]),
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
    ]),
    GrCrudModule,
  ],
  controllers: [TodosCrudController],
  providers: [TodosCrudService, GrCrudService],
})
export class TodosCrudModule {}
