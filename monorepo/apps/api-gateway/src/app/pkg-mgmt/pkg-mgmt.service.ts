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
  AddGrMbReqDto,
  RmGrMbReqDto,
  UpdateGrMbResDto,
  CreateGrReqDto,
  CreateGrResDto,
  CreatePkgReqDto,
  CreatePkgResDto,
  GetGrResDto,
  GetPkgResDto,
  kafkaTopic,
  UpdateGrReqDto,
  UpdateGrResDto,
  UpdatePkgReqDto,
  UpdatePkgResDto,
  UpdateGrPkgResDto,
  UpdateGrPkgReqDto,
  PackageDto,
  GroupDto,
  BaseResDto,
  ValidateJoinGroupTokenResDto,
  MemberDto,
  GetGrsByUserResDto,
  UpdateAvatarReqDto,
  UpdateAvatarResDto,
  ActivateGrPkgReqDto,
  ActivateGrPkgResDto,
  PkgGrInvReqDto,
  UpdateChannelReqDto,
  UpdateChannelResDto,
  CreateBillReqDto,
  CreateBillResDto,
  GetGrChannelResDto,
} from '@nyp19vp-be/shared';
import { Types } from 'mongoose';
import { catchError, firstValueFrom, timeout } from 'rxjs';
import { SocketGateway } from '../socket/socket.gateway';

@Injectable()
export class PkgMgmtService {
  constructor(
    @Inject('PKG_MGMT_SERVICE') private readonly packageMgmtClient: ClientKafka,
    @Inject('AUTH_SERVICE') private readonly authClient: ClientKafka,
    private readonly socketGateway: SocketGateway,
  ) {}

  async createPkg(createPkgReqDto: CreatePkgReqDto): Promise<CreatePkgResDto> {
    return await firstValueFrom(
      this.packageMgmtClient.send(
        kafkaTopic.PACKAGE_MGMT.CREATE_PKG,
        JSON.stringify(createPkgReqDto),
      ),
    ).then((res) => {
      if (res.statusCode == HttpStatus.CREATED) return res;
      else
        throw new HttpException(res.message, res.statusCode, {
          cause: new Error(res.error),
          description: res.error,
        });
    });
  }

  async getAllPkg(
    collectionDto: CollectionDto,
  ): Promise<CollectionResponse<PackageDto>> {
    return await firstValueFrom(
      this.packageMgmtClient.send(
        kafkaTopic.PACKAGE_MGMT.GET_ALL_PKGS,
        collectionDto,
      ),
    );
  }
  async getPkgById(id: Types.ObjectId): Promise<GetPkgResDto> {
    return await firstValueFrom(
      this.packageMgmtClient.send(kafkaTopic.PACKAGE_MGMT.GET_PKG_BY_ID, id),
    ).then((res) => {
      if (res.statusCode == HttpStatus.OK) return res;
      else
        throw new HttpException(res.message, res.statusCode, {
          cause: new Error(res.error),
          description: res.error,
        });
    });
  }
  async updatePkg(updatePkgReqDto: UpdatePkgReqDto): Promise<UpdatePkgResDto> {
    return await firstValueFrom(
      this.packageMgmtClient.send(
        kafkaTopic.PACKAGE_MGMT.UPDATE_PKG,
        JSON.stringify(updatePkgReqDto),
      ),
    ).then((res) => {
      if (res.statusCode == HttpStatus.OK) return res;
      else
        throw new HttpException(res.message, res.statusCode, {
          cause: new Error(res.error),
          description: res.error,
        });
    });
  }
  async deletePkg(id: Types.ObjectId): Promise<CreatePkgResDto> {
    return await firstValueFrom(
      this.packageMgmtClient.send(kafkaTopic.PACKAGE_MGMT.DELETE_PKG, id),
    ).then((res) => {
      if (res.statusCode == HttpStatus.OK) return res;
      else
        throw new HttpException(res.message, res.statusCode, {
          cause: new Error(res.error),
          description: res.error,
        });
    });
  }
  async restorePkg(id: Types.ObjectId): Promise<CreatePkgResDto> {
    return await firstValueFrom(
      this.packageMgmtClient.send(kafkaTopic.PACKAGE_MGMT.RESTORE_GR, id),
    ).then((res) => {
      if (res.statusCode == HttpStatus.OK) return res;
      else
        throw new HttpException(res.message, res.statusCode, {
          cause: new Error(res.error),
          description: res.error,
        });
    });
  }
  async createGr(createGrReqDto: CreateGrReqDto): Promise<CreateGrResDto> {
    return await firstValueFrom(
      this.packageMgmtClient.send(
        kafkaTopic.PACKAGE_MGMT.CREATE_GR,
        JSON.stringify(createGrReqDto),
      ),
    ).then((res) => {
      if (res.statusCode == HttpStatus.CREATED) return res;
      else
        throw new HttpException(res.message, res.statusCode, {
          cause: new Error(res.error),
          description: res.error,
        });
    });
  }
  async getAllGr(
    collectionDto: CollectionDto,
  ): Promise<CollectionResponse<GroupDto>> {
    return await firstValueFrom(
      this.packageMgmtClient.send(
        kafkaTopic.PACKAGE_MGMT.GET_ALL_GRS,
        collectionDto,
      ),
    );
  }
  async getGrById(id: Types.ObjectId): Promise<GetGrResDto> {
    return await firstValueFrom(
      this.packageMgmtClient.send(kafkaTopic.PACKAGE_MGMT.GET_GR_BY_ID, id),
    ).then((res) => {
      if (res.statusCode == HttpStatus.OK) return res;
      else
        throw new HttpException(res.message, res.statusCode, {
          cause: new Error(res.error),
          description: res.error,
        });
    });
  }
  async updateGr(updatePkgReqDto: UpdateGrReqDto): Promise<UpdateGrResDto> {
    return await firstValueFrom(
      this.packageMgmtClient.send(
        kafkaTopic.PACKAGE_MGMT.UPDATE_GR,
        JSON.stringify(updatePkgReqDto),
      ),
    ).then((res) => {
      if (res.statusCode == HttpStatus.OK) return res;
      else
        throw new HttpException(res.message, res.statusCode, {
          cause: new Error(res.error),
          description: res.error,
        });
    });
  }
  async deleteGr(id: Types.ObjectId): Promise<CreateGrResDto> {
    return await firstValueFrom(
      this.packageMgmtClient.send(kafkaTopic.PACKAGE_MGMT.DELETE_GR, id),
    ).then((res) => {
      if (res.statusCode == HttpStatus.OK) return res;
      else
        throw new HttpException(res.message, res.statusCode, {
          cause: new Error(res.error),
          description: res.error,
        });
    });
  }
  async restoreGr(id: Types.ObjectId): Promise<CreateGrResDto> {
    return await firstValueFrom(
      this.packageMgmtClient.send(kafkaTopic.PACKAGE_MGMT.RESTORE_GR, id),
    ).then((res) => {
      if (res.statusCode == HttpStatus.OK) return res;
      else
        throw new HttpException(res.message, res.statusCode, {
          cause: new Error(res.error),
          description: res.error,
        });
    });
  }
  async addGrMemb(updateGrMbReqDto: AddGrMbReqDto): Promise<UpdateGrMbResDto> {
    return await firstValueFrom(
      this.packageMgmtClient.send(
        kafkaTopic.PACKAGE_MGMT.ADD_GR_MEMB,
        JSON.stringify(updateGrMbReqDto),
      ),
    ).then((res) => {
      if (res.statusCode == HttpStatus.OK) return res;
      else
        throw new HttpException(res.message, res.statusCode, {
          cause: new Error(res.error),
          description: res.error,
        });
    });
  }
  async rmGrMemb(updateGrMbReqDto: RmGrMbReqDto): Promise<UpdateGrMbResDto> {
    return await firstValueFrom(
      this.packageMgmtClient.send(
        kafkaTopic.PACKAGE_MGMT.RM_GR_MEMB,
        JSON.stringify(updateGrMbReqDto),
      ),
    ).then((res) => {
      if (res.statusCode == HttpStatus.OK) return res;
      else
        throw new HttpException(res.message, res.statusCode, {
          cause: new Error(res.error),
          description: res.error,
        });
    });
  }
  async rmGrPkg(
    updateGrPkgReqDto: UpdateGrPkgReqDto,
  ): Promise<UpdateGrPkgResDto> {
    return await firstValueFrom(
      this.packageMgmtClient.send(
        kafkaTopic.PACKAGE_MGMT.RM_GR_PKG,
        JSON.stringify(updateGrPkgReqDto),
      ),
    ).then((res) => {
      if (res.statusCode == HttpStatus.OK) return res;
      else
        throw new HttpException(res.message, res.statusCode, {
          cause: new Error(res.error),
          description: res.error,
        });
    });
  }
  async addGrPkg(
    updateGrPkgReqDto: UpdateGrPkgReqDto,
  ): Promise<UpdateGrPkgResDto> {
    return await firstValueFrom(
      this.packageMgmtClient.send(
        kafkaTopic.PACKAGE_MGMT.ADD_GR_PKG,
        JSON.stringify(updateGrPkgReqDto),
      ),
    ).then((res) => {
      if (res.statusCode == HttpStatus.OK) return res;
      else
        throw new HttpException(res.message, res.statusCode, {
          cause: new Error(res.error),
          description: res.error,
        });
    });
  }

  async invToJoinGr(reqDto: PkgGrInvReqDto): Promise<BaseResDto> {
    console.log('reqDto', reqDto);

    const resDto = await firstValueFrom(
      this.authClient.send(
        kafkaTopic.AUTH.GENERATE_JOIN_GR_TOKEN,
        JSON.stringify(reqDto),
      ),
    );

    return resDto;
  }

  async joinGr(userInfoId: string, token: string): Promise<BaseResDto> {
    const decodeRes: ValidateJoinGroupTokenResDto = await firstValueFrom(
      this.authClient.send(
        kafkaTopic.AUTH.VALIDATE_JOIN_GR_TOKEN,
        JSON.stringify({ token }),
      ),
    );

    console.log('decodeRes', decodeRes);
    decodeRes.user = userInfoId;

    const payload: AddGrMbReqDto = {
      _id: decodeRes['grId'] || null,
      user: userInfoId || null,
      addedBy: decodeRes['addedBy'] || null,
    };

    return await firstValueFrom(
      this.packageMgmtClient.send(
        kafkaTopic.PACKAGE_MGMT.ADD_GR_MEMB,
        JSON.stringify(payload),
      ),
    ).then(async (res) => {
      if (res.statusCode == HttpStatus.OK) {
        await this.socketGateway.handleEvent(
          'joinGr',
          payload.user,
          payload.user,
        );
        return res;
      } else
        throw new HttpException(res.message, res.statusCode, {
          cause: new Error(res.error),
          description: res.error,
        });
    });
  }
  async getGrByUserId(memberDto: MemberDto): Promise<GetGrsByUserResDto> {
    return await firstValueFrom(
      this.packageMgmtClient.send(
        kafkaTopic.PACKAGE_MGMT.GET_GRS_BY_USER,
        JSON.stringify(memberDto),
      ),
    ).then((res) => {
      if (res.statusCode == HttpStatus.OK) return res;
      else
        throw new HttpException(res.message, res.statusCode, {
          cause: new Error(res.error),
          description: res.error,
        });
    });
  }
  async updateAvatar(
    updateAvatarReqDto: UpdateAvatarReqDto,
  ): Promise<UpdateAvatarResDto> {
    return await firstValueFrom(
      this.packageMgmtClient
        .send(
          kafkaTopic.PACKAGE_MGMT.UPDATE_GR_AVATAR,
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
  async activateGrPkg(
    activateGrPkgReqDto: ActivateGrPkgReqDto,
  ): Promise<ActivateGrPkgResDto> {
    return await firstValueFrom(
      this.packageMgmtClient
        .send(
          kafkaTopic.PACKAGE_MGMT.ACTIVATE_GR_PKG,
          JSON.stringify(activateGrPkgReqDto),
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
  async updateChannel(
    updateChannelReqDto: UpdateChannelReqDto,
  ): Promise<UpdateChannelResDto> {
    return await firstValueFrom(
      this.packageMgmtClient
        .send(
          kafkaTopic.PACKAGE_MGMT.UPDATE_GR_CHANNEL,
          JSON.stringify(updateChannelReqDto),
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
  async getGrChannelByUserId(id: Types.ObjectId): Promise<GetGrChannelResDto> {
    return await firstValueFrom(
      this.packageMgmtClient
        .send(kafkaTopic.PACKAGE_MGMT.GET_GR_CHANNEL_BY_USER, id)
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
  async createBilling(
    createBillReqDto: CreateBillReqDto,
  ): Promise<CreateBillResDto> {
    return await firstValueFrom(
      this.packageMgmtClient
        .send(
          kafkaTopic.PACKAGE_MGMT.CREATE_GR_BILL,
          JSON.stringify(createBillReqDto),
        )
        .pipe(
          timeout(5000),
          catchError(() => {
            throw new RequestTimeoutException();
          }),
        ),
    ).then((res) => {
      if (res.statusCode == HttpStatus.CREATED) {
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
