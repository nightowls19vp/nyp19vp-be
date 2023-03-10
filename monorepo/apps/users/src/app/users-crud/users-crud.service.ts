import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  CreateUserReqDto,
  CreateUserResDto,
  GetUserInfoResDto,
  GetUserSettingResDto,
  UpdateAvatarReqDto,
  UpdateAvatarResDto,
  UpdateSettingReqDto,
  UpdateSettingResDto,
  UpdateUserReqDto,
  UpdateUserResDto,
  UserDto,
  UsersDto,
} from '@nyp19vp-be/shared';
import { Model, now } from 'mongoose';
import { User, UserDocument } from '../../schemas/users.schema';
import { ObjectId } from 'mongodb';

@Injectable()
export class UsersCrudService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserReqDto: CreateUserReqDto): Promise<CreateUserResDto> {
    console.log('users-svc#create-user: ', createUserReqDto);
    const newUser = new this.userModel({
      name: createUserReqDto.name,
      dob: createUserReqDto.dob,
      phone: createUserReqDto.phone,
      email: createUserReqDto.email,
    });
    await newUser.save();
    return Promise.resolve({
      status: 'success',
      msg: `create user #${createUserReqDto.email} successfully`,
    });
  }

  async findAll() {
    const users = await this.userModel.find().exec();
    const userList = new UsersDto();

    users.forEach(function (ele) {
      const user = new UserDto();
      user.user = ele;
      user.setting = ele.setting;
      user.createdAt = ele.createdAt;
      user.updatedAt = ele.updatedAt;
      userList.users.push(user);
    });
    return userList;
    // return Promise.resolve({
    //   status: 'success',
    //   msg: `get user #${id} successfully`,
    //   });
    // });
  }

  async findInfoById(id: string): Promise<GetUserInfoResDto> {
    console.log(`users-svc#get-user-by-id: `, id);
    const _id: ObjectId = new ObjectId(id);
    const user = await this.userModel.findOne({ _id: _id });
    console.log(user);
    return Promise.resolve({
      status: 'success',
      msg: `get user #${id} successfully`,
      user: user,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }

  async findSettingById(id: string): Promise<GetUserSettingResDto> {
    console.log(`users-svc#get-setting-by-id: `, id);
    const _id: ObjectId = new ObjectId(id);
    const user = await this.userModel.findOne({ _id: _id });
    return Promise.resolve({
      status: 'success',
      msg: `get user #${id} successfully`,
      setting: user.setting,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }

  async updateInfo(
    updateUserReqDto: UpdateUserReqDto
  ): Promise<UpdateUserResDto> {
    console.log(`users-svc#udpate-user: `, updateUserReqDto._id);
    const id: ObjectId = new ObjectId(updateUserReqDto._id);
    await this.userModel.updateOne(
      { _id: id },
      {
        name: updateUserReqDto.name,
        dob: updateUserReqDto.dob,
        phone: updateUserReqDto.phone,
      }
    );
    return Promise.resolve({
      status: 'success',
      msg: `update user #${updateUserReqDto._id} successfully`,
    });
  }

  async updateSetting(
    updateSettingReqDto: UpdateSettingReqDto
  ): Promise<UpdateSettingResDto> {
    console.log(`users-svc#udpate-setting: `, updateSettingReqDto._id);
    const id: ObjectId = new ObjectId(updateSettingReqDto._id);
    await this.userModel.updateOne(
      { _id: id },
      {
        setting: updateSettingReqDto,
      }
    );
    return Promise.resolve({
      status: 'success',
      msg: `update user #${updateSettingReqDto._id} successfully`,
    });
  }

  async updateAvatar(
    updateAvatarReqDto: UpdateAvatarReqDto
  ): Promise<UpdateAvatarResDto> {
    console.log(`users-svc#udpate-avatar: `, updateAvatarReqDto._id);
    const id: ObjectId = new ObjectId(updateAvatarReqDto._id);
    await this.userModel.updateOne(
      { _id: id },
      { avatar: updateAvatarReqDto.avatar }
    );
    return Promise.resolve({
      status: 'success',
      msg: `update user #${updateAvatarReqDto._id} successfully`,
    });
  }

  async removeUser(id: string): Promise<CreateUserResDto> {
    console.log(`users-svc#delete-user: `, id);
    const _id: ObjectId = new ObjectId(id);
    await this.userModel.updateOne(
      { _id: _id },
      { deletedAt: new Date(now()) }
    );
    return Promise.resolve({
      status: 'success',
      msg: `delete user #${id} successfully`,
    });
  }
}
