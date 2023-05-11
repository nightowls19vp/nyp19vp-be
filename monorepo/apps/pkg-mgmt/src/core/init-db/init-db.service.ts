import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Package, PackageDocument } from '../../schemas/package.schema';
import { SoftDeleteModel } from 'mongoose-delete';

@Injectable()
export class InitDbService {
  constructor(
    @InjectModel(Package.name)
    private pkgModel: SoftDeleteModel<PackageDocument>,
  ) {
    this.initPkg();
  }

  async initPkg() {
    console.log('Init package database');

    await this.pkgModel
      .count()
      .then(async (res) => {
        if (res == 0) {
          const ExPkg = new this.pkgModel({
            name: 'Experience Package',
            duration: 1,
            price: 70000,
            noOfMember: 2,
            description:
              'Essentiels management\nGroup Chat\nGroup Call\nSpending management',
          });
          const FamiPkg = new this.pkgModel({
            name: 'Family Package',
            duration: 12,
            price: 50000,
            noOfMember: 4,
            description:
              'Essentiels management\nGroup Chat\nGroup Call\nSpending management\nNotification\nScheduling',
          });
          const AnPkg = new this.pkgModel({
            name: 'Annual Package',
            duration: 12,
            price: 500000,
            noOfMember: 2,
            description:
              'Essentiels management\nGroup Chat\nGroup Call\nSpending management\nNotification\nScheduling',
          });
          const CustomPkg = new this.pkgModel({
            name: 'Customized Package',
            duration: 1,
            price: 75000,
            noOfMember: 2,
            description:
              'Essentiels management\nGroup Chat\nGroup Call\nSpending management\nNotification\nScheduling',
          });
          await this.pkgModel.insertMany([ExPkg, FamiPkg, AnPkg, CustomPkg]);
        }
      })
      .catch((err) => {
        throw err;
      });
  }
}
