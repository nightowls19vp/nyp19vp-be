import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DataFactory, Seeder } from 'nestjs-seeder';
import { Package, PackageDocument } from '../../schemas/package.schema';

@Injectable()
export class PackageSeeder implements Seeder {
  constructor(
    @InjectModel(Package.name) private pkgModel: Model<PackageDocument>
  ) {}

  async seed(): Promise<any> {
    // Generate 10 packages.
    const count = await this.pkgModel.count();
    if (count == 0) {
      const users = DataFactory.createForClass(Package).generate(10);

      // Insert into the database.
      return await this.pkgModel.insertMany(users);
    }
  }

  async drop(): Promise<any> {
    return await this.pkgModel.deleteMany({});
  }
}
