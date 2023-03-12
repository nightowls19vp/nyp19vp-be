import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import {
  CreateUserReqDto,
  CreateUserResDto,
  GetCartResDto,
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
  UpdateUserReqDto,
  UpdateUserResDto,
} from '@nyp19vp-be/shared';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USERS_SERVICE') private readonly usersClient: ClientKafka
  ) {}
  createUser(createUserReqDto: CreateUserReqDto): Promise<CreateUserResDto> {
    return firstValueFrom(
      this.usersClient.send(kafkaTopic.USERS.CREATE, createUserReqDto)
    );
  }
  updateUser(updateUserReqDto: UpdateUserReqDto): Promise<UpdateUserResDto> {
    return firstValueFrom(
      this.usersClient.send(kafkaTopic.USERS.UPDATE_INFO, updateUserReqDto)
    );
  }
  async getUserInfoById(id: string): Promise<GetUserInfoResDto> {
    return firstValueFrom(
      this.usersClient.send(kafkaTopic.USERS.GET_INFO_BY_ID, id)
    );
  }
  getUserSettingById(id: string): Promise<GetUserSettingResDto> {
    return firstValueFrom(
      this.usersClient.send(kafkaTopic.USERS.GET_SETTING_BY_ID, id)
    );
  }
  getAllUsers(req: Request): Promise<GetUsersResDto> {
    return firstValueFrom(this.usersClient.send(kafkaTopic.USERS.GET_ALL, req));
  }
  updateSetting(
    updateSettingReqDto: UpdateSettingReqDto
  ): Promise<UpdateSettingResDto> {
    return firstValueFrom(
      this.usersClient.send(
        kafkaTopic.USERS.UPDATE_SETTING,
        updateSettingReqDto
      )
    );
  }
  updateAvatar(
    updateAvatarReqDto: UpdateAvatarReqDto
  ): Promise<UpdateAvatarResDto> {
    return firstValueFrom(
      this.usersClient.send(kafkaTopic.USERS.UPDATE_AVATAR, updateAvatarReqDto)
    );
  }
  deleteUser(id: string): Promise<CreateUserResDto> {
    return firstValueFrom(
      this.usersClient.send(kafkaTopic.USERS.DELETE_ONE, id)
    );
  }
  updateCart(updateCartReqDto: UpdateCartReqDto): Promise<UpdateCartResDto>{
    return firstValueFrom(
      this.usersClient.send(kafkaTopic.USERS.UPDATE_CART, updateCartReqDto)
    );
  }
  getCart(id: string): Promise<GetCartResDto>{
    return firstValueFrom(
      this.usersClient.send(kafkaTopic.USERS.GET_CART, id)
    );
  }
}
