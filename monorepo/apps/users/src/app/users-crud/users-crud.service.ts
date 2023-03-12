import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  CreateUserReqDto,
  CreateUserResDto,
  GetCartResDto,
  GetUserInfoResDto,
  GetUserSettingResDto,
  GetUsersResDto,
  UpdateAvatarReqDto,
  UpdateAvatarResDto,
  UpdateCartReqDto,
  UpdateCartResDto,
  UpdateSettingReqDto,
  UpdateSettingResDto,
  UpdateUserReqDto,
  UpdateUserResDto,
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

  async findAll(): Promise<GetUsersResDto> {
    console.log(`users-svc#get-all-users`);
    const users = await this.userModel.find({ deletedAt: null }).exec();
    // eslint-disable-next-line prefer-const
    let userList = [];
    users.forEach(function (ele) {
      userList.push(ele);
    });
    if(userList.length != 0 ){
      return Promise.resolve({
        status: 'success',
        msg: 'get all users successfully',
        users: userList
      });
    } else {
      return Promise.resolve({
        status: 'fail',
        msg: 'No users found',
        users: userList
      });
    }
    
  }

  async findInfoById(id: string): Promise<GetUserInfoResDto>{
    console.log(`users-svc#get-user-by-id:`, id);
    const _id: ObjectId = new ObjectId(id);
    const user = await this.userModel.findOne({ _id: _id, deletedAt: null });
    if(user != null)
      return Promise.resolve({
        status: 'success',
        msg: `get user #${id} successfully`,
        user: user
      });
    else 
      return Promise.resolve({
        status: 'fail',
        msg: `No user with id: #${id} found`,
        user: user
      });
  }

  async findSettingById(id: string): Promise<GetUserSettingResDto> {
    console.log(`users-svc#get-setting-by-id:`, id);
    const _id: ObjectId = new ObjectId(id);
    const user = await this.userModel.findOne({ _id: _id, deletedAt: null }, {setting: 1, _id: 0});
    if(user != null){
      return Promise.resolve({
        status: 'success',
        msg: `get user #${id} successfully`,
        setting: user.setting
      });
    } else {
      return Promise.resolve({
        status: 'fail',
        msg: `No user with id: #${id} found`,
        setting: user.setting
      });
    }
  }

  async updateInfo(
    updateUserReqDto: UpdateUserReqDto
  ): Promise<UpdateUserResDto> {
    console.log(`users-svc#udpate-user:`, updateUserReqDto._id);
    const id: ObjectId = new ObjectId(updateUserReqDto._id);
    const res = await this.userModel.updateOne(
      { _id: id },
      {
        name: updateUserReqDto.name,
        dob: updateUserReqDto.dob,
        phone: updateUserReqDto.phone,
      }
    );
    console.log(res)
    return Promise.resolve({
      status: 'success',
      msg: `update user #${updateUserReqDto._id} successfully`,
    });
  }

  async updateSetting(
    updateSettingReqDto: UpdateSettingReqDto
  ): Promise<UpdateSettingResDto> {
    console.log(`users-svc#udpate-setting:`, updateSettingReqDto._id);
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
    console.log(`users-svc#udpate-avatar:`, updateAvatarReqDto._id);
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
    console.log(`users-svc#delete-user:`, id);
    const _id: ObjectId = new ObjectId(id);
    await this.userModel.updateOne(
      { _id: _id },
      { deletedAt: new Date(now())},
      {new: true}
    );
    return Promise.resolve({
      status: 'success',
      msg: `delete user #${id} successfully`,
    });
  }

  async updateCart(updateCartReqDto: UpdateCartReqDto): Promise<UpdateCartResDto> {
    console.log(`update items of user's cart`, updateCartReqDto.cart);
    const _id: ObjectId = new ObjectId(updateCartReqDto._id);
    const cart = this.userModel.updateOne(
      { _id: _id },
      { cart: updateCartReqDto.cart },
      { new: true }
    )
    return Promise.resolve({
      status: 'success',
      msg: `${cart}`,
    });
  }

  async getCart(id: string): Promise<GetCartResDto> {
    console.log(`get items from user's cart`, id);
    const res = await this.userModel.find(
      { _id: id },
      { cart: 1, _id: 0 },
    )
    // eslint-disable-next-line prefer-const
    let cart = [];
    res.forEach(function (ele) {
      cart.push(ele);
    });
    if(cart.length != 0){
      return Promise.resolve({
        status: 'success',
        msg: `get user #${id}'s cart `,
        cart: cart
      });
    } else {
      return Promise.resolve({
        status: 'fail',
        msg: `No items found in user #${id}'s cart`,
        cart: cart
      });
    }
    
  }
}

