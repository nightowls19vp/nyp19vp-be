import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import {
  CreateUserReqDto,
  CreateUserResDto,
  GetCartResDto,
  GetTrxHistResDto,
  GetUserInfoResDto,
  GetUserSettingResDto,
  GetUsersResDto,
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
} from '@nyp19vp-be/shared';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USERS_SERVICE') private readonly usersClient: ClientKafka
  ) {}
  async createUser(
    createUserReqDto: CreateUserReqDto
  ): Promise<CreateUserResDto> {
    const res = await firstValueFrom(
      this.usersClient.send(kafkaTopic.USERS.CREATE, createUserReqDto)
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
    updateUserReqDto: UpdateUserReqDto
  ): Promise<UpdateUserResDto> {
    const res = await firstValueFrom(
      this.usersClient.send(kafkaTopic.USERS.UPDATE_INFO, updateUserReqDto)
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
    const res = await firstValueFrom(
      this.usersClient.send(kafkaTopic.USERS.GET_INFO_BY_ID, id)
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
  async getUserBy(option: string): Promise<GetUsersResDto> {
    const res = await firstValueFrom(
      this.usersClient.send(kafkaTopic.USERS.GET_INFO_BY, option)
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
  async getUserSettingById(id: string): Promise<GetUserSettingResDto> {
    const res = await firstValueFrom(
      this.usersClient.send(kafkaTopic.USERS.GET_SETTING_BY_ID, id)
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
  async getAllUsers(req: Request): Promise<GetUsersResDto> {
    const res = await firstValueFrom(
      this.usersClient.send(kafkaTopic.USERS.GET_ALL, req)
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
  async updateSetting(
    updateSettingReqDto: UpdateSettingReqDto
  ): Promise<UpdateSettingResDto> {
    const res = await firstValueFrom(
      this.usersClient.send(
        kafkaTopic.USERS.UPDATE_SETTING,
        updateSettingReqDto
      )
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
  async updateAvatar(
    updateAvatarReqDto: UpdateAvatarReqDto
  ): Promise<UpdateAvatarResDto> {
    const res = await firstValueFrom(
      this.usersClient.send(kafkaTopic.USERS.UPDATE_AVATAR, updateAvatarReqDto)
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
  async deleteUser(id: string): Promise<CreateUserResDto> {
    const res = await firstValueFrom(
      this.usersClient.send(kafkaTopic.USERS.DELETE_ONE, id)
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
  async updateCart(
    updateCartReqDto: UpdateCartReqDto
  ): Promise<UpdateCartResDto> {
    const res = await firstValueFrom(
      this.usersClient.send(kafkaTopic.USERS.UPDATE_CART, updateCartReqDto)
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
  async getCart(id: string): Promise<GetCartResDto> {
    const res = await firstValueFrom(
      this.usersClient.send(kafkaTopic.USERS.GET_CART, id)
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
  async getTrxHist(id: string): Promise<GetTrxHistResDto> {
    const res = await firstValueFrom(
      this.usersClient.send(kafkaTopic.USERS.GET_TRX, id)
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
  async updateTrxHist(
    updateTrxHistReqDto: UpdateTrxHistReqDto
  ): Promise<UpdateTrxHistResDto> {
    const res = await firstValueFrom(
      this.usersClient.send(kafkaTopic.USERS.UPDATE_TRX, updateTrxHistReqDto)
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
}
