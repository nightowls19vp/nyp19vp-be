import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DataFactory, Seeder } from 'nestjs-seeder';
import { User, UserDocument } from '../../schemas/users.schema';

@Injectable()
export class UsersSeeder implements Seeder {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async seed(): Promise<any> {
    const count = await this.userModel.count();
    if (count == 0) {
      // Generate 10 users.
      const users = DataFactory.createForClass(User).generate(10);

      // Insert into the database.
      return await this.userModel.insertMany(users);
    }
  }

  async drop(): Promise<any> {
    return await this.userModel.deleteMany({});
  }
}
