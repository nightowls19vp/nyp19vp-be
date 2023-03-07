import { Module } from '@nestjs/common';
import { UsersCrudService } from './users-crud.service';
import { UsersCrudController } from './users-crud.controller';

@Module({
  controllers: [UsersCrudController],
  providers: [UsersCrudService],
})
export class UsersCrudModule {}
