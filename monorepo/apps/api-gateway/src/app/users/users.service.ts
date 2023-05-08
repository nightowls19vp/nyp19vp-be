import {
  CollectionDto,
  CollectionResponse,
} from '@forlagshuset/nestjs-mongoose-paginate';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
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
  UpdateUserReqDto,
  UpdateUserResDto,
  UserDto,
  ZPCheckoutResDto,
} from '@nyp19vp-be/shared';
import { Types } from 'mongoose';
import { catchError, firstValueFrom, timeout } from 'rxjs';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USERS_SERVICE') private readonly usersClient: ClientKafka,
  ) {}
  async createUser(
    createUserReqDto: CreateUserReqDto,
  ): Promise<CreateUserResDto> {
    const res = await firstValueFrom(
      this.usersClient
        .send(kafkaTopic.USERS.CREATE, JSON.stringify(createUserReqDto))
        .pipe(
          timeout(5000),
          catchError(() => {
            throw new RequestTimeoutException();
          }),
        ),
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
      this.usersClient
        .send(kafkaTopic.USERS.UPDATE_INFO, JSON.stringify(updateUserReqDto))
        .pipe(
          timeout(5000),
          catchError(() => {
            throw new RequestTimeoutException();
          }),
        ),
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
  async getUserById(id: Types.ObjectId): Promise<GetUserInfoResDto> {
    return await firstValueFrom(
      this.usersClient.send(kafkaTopic.USERS.GET_INFO_BY_ID, id).pipe(
        timeout(5000),
        catchError(() => {
          throw new RequestTimeoutException();
        }),
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
  async getUserSettingById(id: Types.ObjectId): Promise<GetUserSettingResDto> {
    return await firstValueFrom(
      this.usersClient.send(kafkaTopic.USERS.GET_SETTING_BY_ID, id).pipe(
        timeout(5000),
        catchError(() => {
          throw new RequestTimeoutException();
        }),
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
      this.usersClient
        .send(
          kafkaTopic.USERS.UPDATE_SETTING,
          JSON.stringify(updateSettingReqDto),
        )
        .pipe(
          timeout(5000),
          catchError(() => {
            throw new RequestTimeoutException();
          }),
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
      this.usersClient
        .send(
          kafkaTopic.USERS.UPDATE_AVATAR,
          JSON.stringify(updateAvatarReqDto),
        )
        .pipe(
          timeout(5000),
          catchError(() => {
            throw new RequestTimeoutException();
          }),
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

  async deleteUser(id: Types.ObjectId): Promise<CreateUserResDto> {
    return await firstValueFrom(
      this.usersClient.send(kafkaTopic.USERS.DELETE_USER, id).pipe(
        timeout(5000),
        catchError(() => {
          throw new RequestTimeoutException();
        }),
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
  async updateCart(
    updateCartReqDto: UpdateCartReqDto,
  ): Promise<UpdateCartResDto> {
    return await firstValueFrom(
      this.usersClient
        .send(kafkaTopic.USERS.UPDATE_CART, JSON.stringify(updateCartReqDto))
        .pipe(
          timeout(5000),
          catchError(() => {
            throw new RequestTimeoutException();
          }),
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
  async getCart(id: Types.ObjectId): Promise<GetCartResDto> {
    return await firstValueFrom(
      this.usersClient.send(kafkaTopic.USERS.GET_CART, id).pipe(
        timeout(5000),
        catchError(() => {
          throw new RequestTimeoutException();
        }),
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
  async checkout(
    updateCartReqDto: UpdateCartReqDto,
  ): Promise<ZPCheckoutResDto> {
    return await firstValueFrom(
      this.usersClient
        .send(kafkaTopic.USERS.CHECKOUT, JSON.stringify(updateCartReqDto))
        .pipe(
          timeout(5000),
          catchError(() => {
            throw new RequestTimeoutException();
          }),
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
  async searchUser(keyword: string): Promise<UserDto[]> {
    return await firstValueFrom(
      this.usersClient.send(kafkaTopic.USERS.SEARCH_USER, keyword).pipe(
        timeout(5000),
        catchError(() => {
          throw new RequestTimeoutException();
        }),
      ),
    );
  }
  async restoreUser(id: Types.ObjectId): Promise<CreateUserResDto> {
    return await firstValueFrom(
      this.usersClient.send(kafkaTopic.USERS.RESTORE_USER, id).pipe(
        timeout(5000),
        catchError(() => {
          throw new RequestTimeoutException();
        }),
      ),
    );
  }
}
