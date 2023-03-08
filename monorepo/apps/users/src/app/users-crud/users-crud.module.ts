import { Module } from '@nestjs/common';
import { UsersCrudService } from './users-crud.service';
import { UsersCrudController } from './users-crud.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../../schemas/users.schema';

@Module({
  imports:[MongooseModule.forFeature([{name: User.name, schema: UserSchema}])],
  controllers: [UsersCrudController],
  providers: [UsersCrudService],
})
export class UsersCrudModule {}
