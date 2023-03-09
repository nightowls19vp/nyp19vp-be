import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserReqDto, CreateUserResDto, UpdateUserReqDto, UpdateUserResDto } from '@nyp19vp-be/shared';
import { Model} from 'mongoose';
import { User, UserDocument } from '../../schemas/users.schema';
import {ObjectId} from 'mongodb'

@Injectable()
export class UsersCrudService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  
  async create(createUserReqDto: CreateUserReqDto): Promise<CreateUserResDto> {
    // const newUser = new this.userModel(createUserReqDto);
    console.log('users-svc#create-user: ', createUserReqDto);
    const now = new Date(Date.now());
    const newUser = new this.userModel({
      name: createUserReqDto.name,
      dob: createUserReqDto.dob,
      phone: createUserReqDto.phone,
      email: createUserReqDto.email,
      // setting: createUserReqDto.setting,
      createdAt: now,
      updatedAt: now,
    });
    await newUser.save();
    return Promise.resolve({
      status: 'success',
      msg: `create user #${createUserReqDto.email} successfully`,
    });
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  findOne(id: number) {
    return `This action returns a #${id} usersCrud`;
  }

  async update(updateUserReqDto: UpdateUserReqDto): Promise<UpdateUserResDto> {
    console.log(`users-svc#udpate-user: `, updateUserReqDto._id);
    const id: ObjectId = new ObjectId(updateUserReqDto._id);
    await this.userModel.updateOne({"_id": id}, {
      name: updateUserReqDto.name,
      dob: updateUserReqDto.dob,
      phone: updateUserReqDto.phone,
      updatedAt: new Date(Date.now()),
    })
    return Promise.resolve({
      status: 'success',
      msg: `update user #${updateUserReqDto._id} successfully`,
    });
  }

  remove(id: number) {
    return `This action removes a #${id} usersCrud`;
  }
}
