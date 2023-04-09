import {
  CollectionDto,
  CollectionResponse,
} from '@forlagshuset/nestjs-mongoose-paginate';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import {
  CreateUserReqDto,
  CreateUserResDto,
  GetCartResDto,
  GetUserInfoResDto,
  GetUserSettingResDto,
  kafkaTopic,
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
} from '@nyp19vp-be/shared';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USERS_SERVICE') private readonly usersClient: ClientKafka,
  ) {}
  async createUser(
    createUserReqDto: CreateUserReqDto,
  ): Promise<CreateUserResDto> {
    const res = await firstValueFrom(
      this.usersClient.send(kafkaTopic.USERS.CREATE, createUserReqDto),
    );
    if (res.statusCode == HttpStatus.CREATED) {
      return res;
    } else {
      throw new HttpException(res.message, res.statusCode, {
        cause: new Error(res.error),
        description: res.error,
      });
    }
  }
  async updateUser(
    updateUserReqDto: UpdateUserReqDto,
  ): Promise<UpdateUserResDto> {
    const res = await firstValueFrom(
      this.usersClient.send(kafkaTopic.USERS.UPDATE_INFO, updateUserReqDto),
    );
    if (res.statusCode == HttpStatus.OK) {
      return res;
    } else {
      throw new HttpException(res.message, res.statusCode, {
        cause: new Error(res.error),
        description: res.error,
      });
    }
  }
  async getUserById(id: string): Promise<GetUserInfoResDto> {
    return await firstValueFrom(
      this.usersClient.send(kafkaTopic.USERS.GET_INFO_BY_ID, id),
    ).then((res) => {
      if (res.statusCode == HttpStatus.OK) {
        return res;
      } else {
        throw new HttpException(res.message, res.statusCode, {
          cause: new Error(res.error),
          description: res.error,
        });
      }
    });
  }

  async getUserByEmail(email: string): Promise<GetUserInfoResDto> {
    return await firstValueFrom(
      this.usersClient.send(kafkaTopic.USERS.GET_INFO_BY_ID, email),
    ).then((res) => {
      if (res.statusCode == HttpStatus.OK) {
        return res;
      } else {
        throw new HttpException(res.message, res.statusCode, {
          cause: new Error(res.error),
          description: res.error,
        });
      }
    });
  }
  async getUserSettingById(id: string): Promise<GetUserSettingResDto> {
    return await firstValueFrom(
      this.usersClient.send(kafkaTopic.USERS.GET_SETTING_BY_ID, id),
    ).then((res) => {
      if (res.statusCode == HttpStatus.OK) {
        return res;
      } else {
        throw new HttpException(res.message, res.statusCode, {
          cause: new Error(res.error),
          description: res.error,
        });
      }
    });
  }
  async getAllUsers(
    collectionDto: CollectionDto,
  ): Promise<CollectionResponse<UserDto>> {
    return await firstValueFrom(
      this.usersClient.send(kafkaTopic.USERS.GET_ALL, collectionDto),
    );
  }
  async updateSetting(
    updateSettingReqDto: UpdateSettingReqDto,
  ): Promise<UpdateSettingResDto> {
    return await firstValueFrom(
      this.usersClient.send(
        kafkaTopic.USERS.UPDATE_SETTING,
        updateSettingReqDto,
      ),
    ).then((res) => {
      if (res.statusCode == HttpStatus.OK) {
        return res;
      } else {
        throw new HttpException(res.message, res.statusCode, {
          cause: new Error(res.error),
          description: res.error,
        });
      }
    });
  }
  async updateAvatar(
    updateAvatarReqDto: UpdateAvatarReqDto,
  ): Promise<UpdateAvatarResDto> {
    return await firstValueFrom(
      this.usersClient.send(kafkaTopic.USERS.UPDATE_AVATAR, updateAvatarReqDto),
    ).then((res) => {
      if (res.statusCode == HttpStatus.OK) {
        return res;
      } else {
        throw new HttpException(res.message, res.statusCode, {
          cause: new Error(res.error),
          description: res.error,
        });
      }
    });
  }
  async deleteUser(id: string): Promise<CreateUserResDto> {
    return await firstValueFrom(
      this.usersClient.send(kafkaTopic.USERS.DELETE_ONE, id),
    ).then((res) => {
      if (res.statusCode == HttpStatus.OK) {
        return res;
      } else {
        throw new HttpException(res.message, res.statusCode, {
          cause: new Error(res.error),
          description: res.error,
        });
      }
    });
  }
  async updateCart(
    updateCartReqDto: UpdateCartReqDto,
  ): Promise<UpdateCartResDto> {
    return await firstValueFrom(
      this.usersClient.send(kafkaTopic.USERS.UPDATE_CART, updateCartReqDto),
    ).then((res) => {
      if (res.statusCode == HttpStatus.OK) {
        return res;
      } else {
        throw new HttpException(res.message, res.statusCode, {
          cause: new Error(res.error),
          description: res.error,
        });
      }
    });
  }
  async getCart(id: string): Promise<GetCartResDto> {
    return await firstValueFrom(
      this.usersClient.send(kafkaTopic.USERS.GET_CART, id),
    ).then((res) => {
      if (res.statusCode == HttpStatus.OK) {
        return res;
      } else {
        throw new HttpException(res.message, res.statusCode, {
          cause: new Error(res.error),
          description: res.error,
        });
      }
    });
  }
  async updateTrxHist(
    updateTrxHistReqDto: UpdateTrxHistReqDto,
  ): Promise<UpdateTrxHistResDto> {
    return await firstValueFrom(
      this.usersClient.send(kafkaTopic.USERS.UPDATE_TRX, updateTrxHistReqDto),
    ).then((res) => {
      if (res.statusCode == HttpStatus.OK) {
        return res;
      } else {
        throw new HttpException(res.message, res.statusCode, {
          cause: new Error(res.error),
          description: res.error,
        });
      }
    });
  }
}
