import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  CheckoutReqDto,
  CreateUserReqDto,
  CreateUserResDto,
  GetCartResDto,
  GetUserInfoResDto,
  GetUserSettingResDto,
  MOP,
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
  ZPCheckoutResDto,
  kafkaTopic,
} from '@nyp19vp-be/shared';
import { Types } from 'mongoose';
import { User, UserDocument } from '../../schemas/users.schema';
import {
  CollectionDto,
  CollectionResponse,
  DocumentCollector,
} from '@forlagshuset/nestjs-mongoose-paginate';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';
import { SoftDeleteModel } from 'mongoose-delete';

@Injectable()
export class UsersCrudService {
  constructor(
    @InjectModel(User.name)
    private userModel: SoftDeleteModel<UserDocument>,
    @Inject('TXN_SERVICE') private readonly txnClient: ClientKafka
  ) {}

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
    return await this.userModel
      .findById({ _id: id })
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
      .findById({ _id: id }, { setting: 1, _id: 0 })
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
    const { _id } = updateUserReqDto;
    console.log(`users-svc#udpate-user:`, _id);
    return await this.userModel
      .findByIdAndUpdate(
        { _id: _id },
        {
          name: updateUserReqDto.name,
          dob: updateUserReqDto.dob,
          phone: updateUserReqDto.phone,
        }
      )
      .then((res) => {
        if (res) {
          return Promise.resolve({
            statusCode: HttpStatus.OK,
            message: `update user #${_id} successfully`,
          });
        } else {
          return Promise.resolve({
            statusCode: HttpStatus.NOT_FOUND,
            message: `No user #${_id} found`,
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
    const { _id } = updateSettingReqDto;
    console.log(`users-svc#udpate-setting:`, _id);
    return await this.userModel
      .findByIdAndUpdate({ _id: _id }, { setting: updateSettingReqDto })
      .then((res) => {
        if (res)
          return Promise.resolve({
            statusCode: HttpStatus.OK,
            message: `update user #${_id} successfully`,
          });
        else
          return Promise.resolve({
            statusCode: HttpStatus.NOT_FOUND,
            message: `No user #${_id} found`,
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
    const { _id } = updateAvatarReqDto;
    console.log(`users-svc#udpate-avatar:`, _id);
    return await this.userModel
      .findByIdAndUpdate({ _id: _id }, { avatar: updateAvatarReqDto.avatar })
      .then((res) => {
        if (res)
          return Promise.resolve({
            statusCode: HttpStatus.OK,
            message: `update user #${_id} successfully`,
          });
        else
          return Promise.resolve({
            statusCode: HttpStatus.NOT_FOUND,
            message: `No user #${_id} found`,
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
    return await this.userModel
      .deleteById(id)
      .then((res) => {
        console.log(res);
        if (res) {
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
  async restoreUser(id: Types.ObjectId): Promise<CreateUserResDto> {
    console.log(`users-svc#restore-deleted-user:`, id);
    return await this.userModel
      .restore({ _id: id })
      .then((res) => {
        console.log(res);
        if (res) {
          return Promise.resolve({
            statusCode: HttpStatus.OK,
            message: `restore deleted user #${id} successfully`,
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
    const { _id, cart } = updateCartReqDto;
    console.log(`update items of user's cart`, cart);
    return await this.userModel
      .findByIdAndUpdate({ _id: _id }, { $set: { cart: cart } })
      .then((res) => {
        if (res)
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
      .findById({ _id: id }, { cart: 1, _id: 0 })
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
    const { _id, trx, cart } = updateTrxHistReqDto;
    console.log(`update items of user's cart`, trx);
    return await this.userModel
      .findByIdAndUpdate(
        { _id: _id },
        { $addToSet: { trxHist: trx }, $pull: { cart: { $in: cart } } }
      )
      .then((res) => {
        if (!res)
          return Promise.resolve({
            statusCode: HttpStatus.NOT_FOUND,
            message: `No user #${_id} found`,
          });
        else
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
  async checkout(checkoutReqDto: CheckoutReqDto): Promise<ZPCheckoutResDto> {
    const { _id, cart, method, ipAddr } = checkoutReqDto;
    console.log(`User #${_id} checkout:`, cart, ipAddr);
    const mop = MOP.KEY[method.type];
    console.log(mop[method.bank_code]);
    const checkExist = await this.userModel.findById({ _id: _id });
    if (checkExist) {
      const checkItem: boolean = cart.every((elem) =>
        checkExist.cart.some((value) => {
          if (value.package == elem.package && value.quantity == elem.quantity)
            return true;
          else return false;
        })
      );
      if (checkItem) {
        return await firstValueFrom(
          this.txnClient
            .send(mop[method.bank_code], checkoutReqDto)
            .pipe(timeout(5000))
        );
      } else {
        return Promise.resolve({
          statusCode: HttpStatus.NOT_FOUND,
          message: `No items found in user #${_id}'s cart`,
          order: null,
          trans: null,
        });
      }
    } else {
      return Promise.resolve({
        statusCode: HttpStatus.NOT_FOUND,
        message: `No user #${_id} found`,
        order: null,
        trans: null,
      });
    }
  }
  async searchUser(keyword: string): Promise<UserDto[]> {
    return await this.userModel.find({ $text: { $search: keyword } });
  }
}
