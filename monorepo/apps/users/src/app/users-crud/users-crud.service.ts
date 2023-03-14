import {
  HttpCode,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  CreateUserReqDto,
  CreateUserResDto,
  GetCartResDto,
  GetTrxHistResDto,
  GetUserInfoResDto,
  GetUserSettingResDto,
  GetUsersResDto,
  UpdateAvatarReqDto,
  UpdateAvatarResDto,
  UpdateCartReqDto,
  UpdateCartResDto,
  UpdateSettingReqDto,
  UpdateSettingResDto,
  UpdateTrxHistReqDto,
  UpdateTrxHistResDto,
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
    try {
      await newUser.save();
      return Promise.resolve({
        statusCode: HttpStatus.CREATED,
        message: `create user #${createUserReqDto.email} successfully`,
      });
    } catch (error) {
      return Promise.resolve({
        statusCode: HttpStatus.BAD_REQUEST,
        message: error.message,
        error: 'BAD REQUEST',
      });
    }
  }

  async findAll(): Promise<GetUsersResDto> {
    console.log(`users-svc#get-all-users`);
    try {
      const users = await this.userModel.find({ deletedAt: null }).exec();
      // eslint-disable-next-line prefer-const
      let userList = [];
      for (const ele of users) {
        userList.push(ele);
      }
      if (userList.length != 0) {
        return Promise.resolve({
          statusCode: HttpStatus.OK,
          message: 'get all users successfully',
          users: userList,
        });
      } else {
        return Promise.resolve({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'No users found',
          error: 'NOT FOUND',
          users: userList,
        });
      }
    } catch (error) {
      return Promise.resolve({
        statusCode: HttpStatus.BAD_REQUEST,
        message: error.message,
        error: 'BAD REQUEST',
        users: null,
      });
    }
  }

  async findInfoById(id: string): Promise<GetUserInfoResDto> {
    console.log(`users-svc#get-user-by-id:`, id);
    const _id: ObjectId = new ObjectId(id);
    try {
      const user = await this.userModel.findOne({ _id: _id, deletedAt: null });
      if (user != null)
        return Promise.resolve({
          statusCode: HttpStatus.OK,
          message: `get user #${id} successfully`,
          user: user,
        });
      else {
        return Promise.resolve({
          statusCode: HttpStatus.NOT_FOUND,
          message: `No user with id: #${id} found`,
          error: 'NOT FOUND',
          user: user,
        });
      }
    } catch (error) {
      return Promise.resolve({
        statusCode: HttpStatus.BAD_REQUEST,
        message: error.message,
        error: 'BAD REQUEST',
        user: null,
      });
    }
  }

  async findSettingById(id: string): Promise<GetUserSettingResDto> {
    console.log(`users-svc#get-setting-by-id:`, id);
    const _id: ObjectId = new ObjectId(id);

    try {
      const user = await this.userModel.findOne(
        { _id: _id, deletedAt: null },
        { setting: 1, _id: 0 }
      );
      if (user != null) {
        return Promise.resolve({
          statusCode: HttpStatus.OK,
          message: `get user #${id} successfully`,
          setting: user.setting,
        });
      } else {
        return Promise.resolve({
          statusCode: HttpStatus.NOT_FOUND,
          message: `No user with id: #${id} found`,
          error: 'NOT FOUND',
          setting: user.setting,
        });
      }
    } catch (error) {
      return Promise.resolve({
        statusCode: HttpStatus.BAD_REQUEST,
        message: error.message,
        error: 'BAD REQUEST',
        setting: null,
      });
    }
  }

  async updateInfo(
    updateUserReqDto: UpdateUserReqDto
  ): Promise<UpdateUserResDto> {
    console.log(`users-svc#udpate-user:`, updateUserReqDto._id);
    const id: ObjectId = new ObjectId(updateUserReqDto._id);
    try {
      await this.userModel.updateOne(
        { _id: id },
        {
          name: updateUserReqDto.name,
          dob: updateUserReqDto.dob,
          phone: updateUserReqDto.phone,
        }
      );
      return Promise.resolve({
        statusCode: HttpStatus.OK,
        message: `update user #${updateUserReqDto._id} successfully`,
      });
    } catch (error) {
      return Promise.resolve({
        statusCode: HttpStatus.BAD_REQUEST,
        message: error.message,
        error: 'BAD REQUEST',
      });
    }
  }

  async updateSetting(
    updateSettingReqDto: UpdateSettingReqDto
  ): Promise<UpdateSettingResDto> {
    console.log(`users-svc#udpate-setting:`, updateSettingReqDto._id);
    const id: ObjectId = new ObjectId(updateSettingReqDto._id);
    try {
      await this.userModel.updateOne(
        { _id: id },
        {
          setting: updateSettingReqDto,
        }
      );
      return Promise.resolve({
        statusCode: HttpStatus.OK,
        message: `update user #${updateSettingReqDto._id} successfully`,
      });
    } catch (error) {
      return Promise.resolve({
        statusCode: HttpStatus.BAD_REQUEST,
        message: error.message,
        error: 'BAD REQUEST',
      });
    }
  }

  async updateAvatar(
    updateAvatarReqDto: UpdateAvatarReqDto
  ): Promise<UpdateAvatarResDto> {
    console.log(`users-svc#udpate-avatar:`, updateAvatarReqDto._id);
    const id: ObjectId = new ObjectId(updateAvatarReqDto._id);
    try {
      await this.userModel.updateOne(
        { _id: id },
        { avatar: updateAvatarReqDto.avatar }
      );
      return Promise.resolve({
        statusCode: HttpStatus.OK,
        message: `update user #${updateAvatarReqDto._id} successfully`,
      });
    } catch (error) {
      return Promise.resolve({
        statusCode: HttpStatus.BAD_REQUEST,
        message: error.message,
        error: 'BAD REQUEST',
      });
    }
  }

  async removeUser(id: string): Promise<CreateUserResDto> {
    console.log(`users-svc#delete-user:`, id);
    const _id: ObjectId = new ObjectId(id);
    try {
      await this.userModel.updateOne(
        { _id: _id },
        { deletedAt: new Date(now()) },
        { new: true }
      );
      return Promise.resolve({
        statusCode: HttpStatus.OK,
        message: `delete user #${id} successfully`,
      });
    } catch (error) {
      return Promise.resolve({
        statusCode: HttpStatus.BAD_REQUEST,
        message: error.message,
        error: 'BAD REQUEST',
      });
    }
  }

  async updateCart(
    updateCartReqDto: UpdateCartReqDto
  ): Promise<UpdateCartResDto> {
    console.log(`update items of user's cart`, updateCartReqDto.cart);
    const _id: ObjectId = new ObjectId(updateCartReqDto._id);
    try {
      const a = await this.userModel.findOneAndUpdate(
        { _id: _id },
        { $set: { cart: updateCartReqDto.cart } },
        { new: true }
      );
      return Promise.resolve({
        statusCode: HttpStatus.OK,
        message: `updated user #${_id}'s cart successfully`,
      });
    } catch (error) {
      return Promise.resolve({
        statusCode: HttpStatus.BAD_REQUEST,
        message: error.message,
        error: 'BAD REQUEST',
      });
    }
  }

  async getCart(id: string): Promise<GetCartResDto> {
    console.log(`get items from user's cart`, id);
    try {
      const res = await this.userModel.find({ _id: id }, { cart: 1, _id: 0 });
      // eslint-disable-next-line prefer-const
      let cart = [];
      res.forEach(function (ele) {
        cart.push(ele);
      });
      if (cart.length != 0) {
        return Promise.resolve({
          statusCode: HttpStatus.OK,
          message: `get user #${id}'s cart successfully`,
          cart: cart,
        });
      } else {
        return Promise.resolve({
          statusCode: HttpStatus.NOT_FOUND,
          message: `No items found in user #${id}'s cart`,
          error: 'NOT FOUND',
          cart: cart,
        });
      }
    } catch (error) {
      return Promise.resolve({
        statusCode: HttpStatus.BAD_REQUEST,
        message: error.message,
        error: 'BAD REQUEST',
        cart: null,
      });
    }
  }

  async getTrxHist(id: string): Promise<GetTrxHistResDto> {
    console.log(`get transaction history of from user`, id);
    try {
      const res = await this.userModel.find({ _id: id }, { cart: 1, _id: 0 });
      // eslint-disable-next-line prefer-const
      let hist = [];
      res.forEach(function (ele) {
        hist.push(ele);
      });
      if (hist.length != 0) {
        return Promise.resolve({
          statusCode: HttpStatus.OK,
          message: `get user #${id}'s cart successfully`,
          trx: hist,
        });
      } else {
        return Promise.resolve({
          statusCode: HttpStatus.NOT_FOUND,
          message: `No transacion history of user #${id} found`,
          error: 'NOT FOUND',
          trx: hist,
        });
      }
    } catch (error) {
      return Promise.resolve({
        statusCode: HttpStatus.BAD_REQUEST,
        message: error.message,
        error: 'BAD REQUEST',
        trx: null,
      });
    }
  }

  async updateTrxHist(
    updateTrxHistReqDto: UpdateTrxHistReqDto
  ): Promise<UpdateTrxHistResDto> {
    console.log(`update items of user's cart`, updateTrxHistReqDto.trx);
    const _id: ObjectId = new ObjectId(updateTrxHistReqDto._id);
    try {
      const a = await this.userModel.findOneAndUpdate(
        { _id: _id },
        { $push: { trxHist: updateTrxHistReqDto.trx } },
        { new: true }
      );
      return Promise.resolve({
        statusCode: HttpStatus.OK,
        message: `updated user #${_id}'s cart successfully`,
      });
    } catch (error) {
      return Promise.resolve({
        statusCode: HttpStatus.BAD_REQUEST,
        message: error.message,
        error: 'BAD REQUEST',
      });
    }
  }
}
