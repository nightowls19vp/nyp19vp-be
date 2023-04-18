import { seeder } from 'nestjs-seeder';
import { MongooseModule } from '@nestjs/mongoose';
import { DataBaseModule } from '../database/database.module';
import { Package, PackageSchema } from '../../schemas/package.schema';
import { PackageSeeder } from './package.seeder';

seeder({
  imports: [
    DataBaseModule,
    MongooseModule.forFeature([{ name: Package.name, schema: PackageSchema }]),
  ],
}).run([PackageSeeder]);

export class SeederModule {}
