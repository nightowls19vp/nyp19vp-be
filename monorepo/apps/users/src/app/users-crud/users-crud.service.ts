import { HttpStatus, Injectable } from '@nestjs/common';
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
    return await newUser
      .save()
      .then(() => {
        return Promise.resolve({
          statusCode: HttpStatus.CREATED,
          message: `create user #${createUserReqDto.email} successfully`,
        });
      })
      .catch((error) => {
        return Promise.resolve({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message,
        });
      });
  }

  async findAll(): Promise<GetUsersResDto> {
    console.log(`users-svc#get-all-users`);
    return await this.userModel
      .find({ deletedAt: null })
      .exec()
      .then((res) => {
        const userList = [];
        for (const ele of res) {
          userList.push(ele);
        }
        if (userList.length) {
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
      })
      .catch((error) => {
        return Promise.resolve({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message,
          users: null,
        });
      });
  }

  async findInfoById(id: string): Promise<GetUserInfoResDto> {
    console.log(`users-svc#get-user-by-id:`, id);
    const _id: ObjectId = new ObjectId(id);
    return await this.userModel
      .findOne({ _id: _id, deletedAt: null })
      .exec()
      .then((res) => {
        if (!res) {
          return Promise.resolve({
            statusCode: HttpStatus.NOT_FOUND,
            message: `No user with id: #${id} found`,
            error: 'NOT FOUND',
            user: res,
          });
        } else {
          return Promise.resolve({
            statusCode: HttpStatus.OK,
            message: `get user #${id} successfully`,
            user: res,
          });
        }
      })
      .catch((error) => {
        return Promise.resolve({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message,
          user: null,
        });
      });
  }

  async findInfoBy(option: string): Promise<GetUsersResDto> {
    console.log(`users-svc#get-user-by:`, option);
    return await this.userModel
      .find({
        $or: [{ name: option }, { phone: option }, { email: option }],
        deletedAt: null,
      })
      .exec()
      .then((res) => {
        // eslint-disable-next-line prefer-const
        let users = [];
        for (const ele of res) {
          users.push(ele);
        }
        if (users.length)
          return Promise.resolve({
            statusCode: HttpStatus.OK,
            message: `get user successfully`,
            users: users,
          });
        else {
          return Promise.resolve({
            statusCode: HttpStatus.NOT_FOUND,
            message: `No user with optional field found`,
            error: 'NOT FOUND',
            users: users,
          });
        }
      })
      .catch((error) => {
        return Promise.resolve({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message,
          users: null,
        });
      });
  }

  async findSettingById(id: string): Promise<GetUserSettingResDto> {
    console.log(`users-svc#get-setting-by-id:`, id);
    const _id: ObjectId = new ObjectId(id);
    return await this.userModel
      .findOne({ _id: _id, deletedAt: null }, { setting: 1, _id: 0 })
      .exec()
      .then((res) => {
        if (!res) {
          return Promise.resolve({
            statusCode: HttpStatus.NOT_FOUND,
            message: `No user with id: #${id} found`,
            error: 'NOT FOUND',
            setting: res.setting,
          });
        } else {
          return Promise.resolve({
            statusCode: HttpStatus.OK,
            message: `get user #${id} successfully`,
            setting: res.setting,
          });
        }
      })
      .catch((error) => {
        return Promise.resolve({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message,
          setting: null,
        });
      });
  }

  async updateInfo(
    updateUserReqDto: UpdateUserReqDto
  ): Promise<UpdateUserResDto> {
    const id = updateUserReqDto._id;
    console.log(`users-svc#udpate-user:`, id);
    const _id: ObjectId = new ObjectId(id);
    return await this.userModel
      .updateOne(
        { _id: _id, deletedAt: null },
        {
          name: updateUserReqDto.name,
          dob: updateUserReqDto.dob,
          phone: updateUserReqDto.phone,
        }
      )
      .then((res) => {
        if (res.matchedCount && res.modifiedCount) {
          return Promise.resolve({
            statusCode: HttpStatus.OK,
            message: `update user #${id} successfully`,
          });
        } else {
          return Promise.resolve({
            statusCode: HttpStatus.NOT_FOUND,
            message: `No user #${id} found`,
          });
        }
      })
      .catch((error) => {
        return Promise.resolve({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message,
        });
      });
  }

  async updateSetting(
    updateSettingReqDto: UpdateSettingReqDto
  ): Promise<UpdateSettingResDto> {
    const id = updateSettingReqDto._id;
    console.log(`users-svc#udpate-setting:`, id);
    const _id: ObjectId = new ObjectId(id);
    return await this.userModel
      .updateOne(
        { _id: _id, deletedAt: null },
        {
          setting: updateSettingReqDto,
        }
      )
      .then((res) => {
        if (res.matchedCount && res.modifiedCount)
          return Promise.resolve({
            statusCode: HttpStatus.OK,
            message: `update user #${id} successfully`,
          });
        else
          return Promise.resolve({
            statusCode: HttpStatus.NOT_FOUND,
            message: `No user #${id} found`,
          });
      })
      .catch((error) => {
        return Promise.resolve({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message,
        });
      });
  }

  async updateAvatar(
    updateAvatarReqDto: UpdateAvatarReqDto
  ): Promise<UpdateAvatarResDto> {
    const id = updateAvatarReqDto._id;
    console.log(`users-svc#udpate-avatar:`, id);
    const _id: ObjectId = new ObjectId(id);
    return await this.userModel
      .updateOne({ _id: _id }, { avatar: updateAvatarReqDto.avatar })
      .then((res) => {
        if (res.matchedCount && res.modifiedCount)
          return Promise.resolve({
            statusCode: HttpStatus.OK,
            message: `update user #${id} successfully`,
          });
        else
          return Promise.resolve({
            statusCode: HttpStatus.NOT_FOUND,
            message: `No user #${id} found`,
          });
      })
      .catch((error) => {
        return Promise.resolve({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message,
        });
      });
  }

  async removeUser(id: string): Promise<CreateUserResDto> {
    console.log(`users-svc#delete-user:`, id);
    const _id: ObjectId = new ObjectId(id);
    return await this.userModel
      .updateOne(
        { _id: _id, deletedAt: null },
        { deletedAt: new Date(now()) },
        { new: true }
      )
      .then((res) => {
        console.log(res);
        if (res.matchedCount && res.modifiedCount) {
          return Promise.resolve({
            statusCode: HttpStatus.OK,
            message: `delete user #${id} successfully`,
          });
        } else {
          return Promise.resolve({
            statusCode: HttpStatus.NOT_FOUND,
            message: `No user #${id} found`,
          });
        }
      })
      .catch((error) => {
        return Promise.resolve({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message,
        });
      });
  }

  async updateCart(
    updateCartReqDto: UpdateCartReqDto
  ): Promise<UpdateCartResDto> {
    const id = updateCartReqDto._id;
    console.log(`update items of user's cart`, updateCartReqDto.cart);
    const _id: ObjectId = new ObjectId(id);
    return await this.userModel
      .updateOne(
        { _id: _id, deletedAt: null },
        { $set: { cart: updateCartReqDto.cart } },
        { new: true }
      )
      .then((res) => {
        if (res.matchedCount && res.matchedCount)
          return Promise.resolve({
            statusCode: HttpStatus.OK,
            message: `updated user #${_id}'s cart successfully`,
          });
        else
          return Promise.resolve({
            statusCode: HttpStatus.NOT_FOUND,
            message: `No user #${_id}'s cart found`,
          });
      })
      .catch((error) => {
        return Promise.resolve({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message,
        });
      });
  }

  async getCart(id: string): Promise<GetCartResDto> {
    console.log(`get items from user's cart`, id);
    return await this.userModel
      .find({ _id: id }, { cart: 1, _id: 0 })
      .exec()
      .then((res) => {
        // eslint-disable-next-line prefer-const
        let cart = [];
        for (const ele of res) {
          cart.push(ele);
        }
        if (cart.length) {
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
      })
      .catch((error) => {
        return Promise.resolve({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message,
          cart: null,
        });
      });
  }

  async getTrxHist(id: string): Promise<GetTrxHistResDto> {
    console.log(`get transaction history of from user`, id);
    return await this.userModel
      .find({ _id: id }, { cart: 1, _id: 0 })
      .exec()
      .then((res) => {
        // eslint-disable-next-line prefer-const
        let hist = [];
        for (const ele of res) {
          hist.push(ele);
        }
        if (hist.length) {
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
      })
      .catch((error) => {
        return Promise.resolve({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message,
          trx: null,
        });
      });
  }

  async updateTrxHist(
    updateTrxHistReqDto: UpdateTrxHistReqDto
  ): Promise<UpdateTrxHistResDto> {
    console.log(`update items of user's cart`, updateTrxHistReqDto.trx);
    const _id: ObjectId = new ObjectId(updateTrxHistReqDto._id);
    return await this.userModel
      .findOneAndUpdate(
        { _id: _id },
        { $push: { trxHist: updateTrxHistReqDto.trx } },
        { new: true }
      )
      .exec()
      .then((res) => {
        console.log(res);
        return Promise.resolve({
          statusCode: HttpStatus.OK,
          message: `updated user #${_id}'s cart successfully`,
        });
      })
      .catch((error) => {
        return Promise.resolve({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message,
        });
      });
  }
}
