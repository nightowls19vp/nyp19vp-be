import { Module } from '@nestjs/common';
import { GrCrudService } from './gr-crud.service';
import { GrCrudController } from './gr-crud.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Group, GroupSchema } from '../../schemas/group.schema';
import { Package, PackageSchema } from '../../schemas/package.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Group.name, schema: GroupSchema }]),
    MongooseModule.forFeature([{ name: Package.name, schema: PackageSchema }]),
  ],
  controllers: [GrCrudController],
  providers: [GrCrudService],
})
export class GrCrudModule {}
