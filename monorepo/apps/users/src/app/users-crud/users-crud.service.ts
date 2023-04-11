import { HttpStatus, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  CreateUserReqDto,
  CreateUserResDto,
  GetCartResDto,
  GetPkgResDto,
  GetUserInfoResDto,
  GetUserSettingResDto,
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
  UserDto,
  kafkaTopic,
} from '@nyp19vp-be/shared';
import { Model, Types, now } from 'mongoose';
import { User, UserDocument } from '../../schemas/users.schema';
import { ObjectId } from 'mongodb';
import {
  CollectionDto,
  CollectionResponse,
  DocumentCollector,
} from '@forlagshuset/nestjs-mongoose-paginate';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class UsersCrudService implements OnModuleInit {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @Inject('TXN_SERVICE') private readonly txnClient: ClientKafka
  ) {}
  async onModuleInit() {
    this.txnClient.subscribeToResponseOf(kafkaTopic.HEALT_CHECK.TXN);
    for (const key in kafkaTopic.TXN) {
      this.txnClient.subscribeToResponseOf(kafkaTopic.TXN[key]);
    }
    await Promise.all([this.txnClient.connect()]);
  }

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
          statusCode: HttpStatus.CONFLICT,
          message: error.message,
        });
      });
  }

  async findAll(
    collectionDto: CollectionDto
  ): Promise<CollectionResponse<UserDto>> {
    console.log(`users-svc#get-all-users`);
    const collector = new DocumentCollector<UserDocument>(this.userModel);
    return await collector
      .find(collectionDto)
      .then((res) => {
        return Promise.resolve({
          data: res.data,
          pagination: res.pagination,
        });
      })
      .catch((err) => {
        throw err;
      });
  }

  async findInfoById(id: Types.ObjectId): Promise<GetUserInfoResDto> {
    console.log(`users-svc#get-user-by-id:`, id);
    // const _id: ObjectId = new ObjectId(id);
    return await this.userModel
      .findOne({ _id: id, deletedAt: { $exists: false } })
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

  async findSettingById(id: Types.ObjectId): Promise<GetUserSettingResDto> {
    console.log(`users-svc#get-setting-by-id:`, id);
    return await this.userModel
      .findOne(
        { _id: id, deletedAt: { $exists: false } },
        { setting: 1, _id: 0 }
      )
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
        { _id: _id, deletedAt: { $exists: false } },
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
        { _id: _id, deletedAt: { $exists: false } },
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
      .updateOne(
        { _id: _id, deletedAt: { $exists: false } },
        { avatar: updateAvatarReqDto.avatar }
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

  async removeUser(id: Types.ObjectId): Promise<CreateUserResDto> {
    console.log(`users-svc#delete-user:`, id);
    const _id: ObjectId = new ObjectId(id);
    return await this.userModel
      .updateOne(
        { _id: _id, deletedAt: { $exists: false } },
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
        { _id: _id, deletedAt: { $exists: false } },
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

  async getCart(id: Types.ObjectId): Promise<GetCartResDto> {
    console.log(`get items from user's cart`, id);
    return await this.userModel
      .findOne({ _id: id, deletedAt: { $exists: false } }, { cart: 1, _id: 0 })
      .then((res) => {
        if (res) {
          return Promise.resolve({
            statusCode: HttpStatus.OK,
            message: `get user #${id}'s cart successfully`,
            cart: res.cart,
          });
        } else {
          return Promise.resolve({
            statusCode: HttpStatus.NOT_FOUND,
            message: `No items found in user #${id}'s cart`,
            error: 'NOT FOUND',
            cart: res.cart,
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
      .then((res) => {
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
  async checkout(updateCartReqDto: UpdateCartReqDto): Promise<any> {
    const { _id, cart } = updateCartReqDto;
    // const checkExist = await this.userModel.findOne({
    //   _id: new ObjectId(_id),
    //   cart: { $elemMatch: { $each: cart } },
    // });
    // if (checkExist)
    console.log(`checkout user #${_id}`);
    return await this.txnClient
      .send(kafkaTopic.TXN.CHECKOUT, updateCartReqDto)
      .subscribe(
        (res: any) => {
          console.log(res);
        },
        (error) => {
          throw error;
        }
      )
      .unsubscribe();
    //   else
    //     return Promise.resolve({
    //       statusCode: HttpStatus.NOT_FOUND,
    //       message: `Items not found in user #${_id}'s cart `,
    //     });
  }
  async searchUser(keyword: string): Promise<UserDto[]> {
    return await this.userModel.find({ $text: { $search: keyword } });
  }
}
