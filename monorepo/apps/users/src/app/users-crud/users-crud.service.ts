import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserReqDto, UpdateUserReqDto } from '@nyp19vp-be/shared';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../schemas/users.schema';

@Injectable()
export class UsersCrudService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  
  async create(createUserReqDto: CreateUserReqDto) {
    const newUser = new this.userModel(createUserReqDto);
    return newUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  findOne(id: number) {
    return `This action returns a #${id} usersCrud`;
  }

  update(id: number, updateUserReqDto: UpdateUserReqDto) {
    return `This action updates a #${id} usersCrud`;
  }

  remove(id: number) {
    return `This action removes a #${id} usersCrud`;
  }
}
