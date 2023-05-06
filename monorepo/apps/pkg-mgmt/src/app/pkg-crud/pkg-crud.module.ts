import { Module } from '@nestjs/common';
import { PkgCrudService } from './pkg-crud.service';
import { PkgCrudController } from './pkg-crud.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Package, PackageSchema } from '../../schemas/package.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Package.name, schema: PackageSchema }]),
  ],
  controllers: [PkgCrudController],
  providers: [PkgCrudService],
})
export class PkgCrudModule {}
