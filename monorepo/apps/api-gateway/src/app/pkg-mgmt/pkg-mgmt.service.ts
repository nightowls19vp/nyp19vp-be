import {
  CollectionDto,
  CollectionResponse,
} from '@forlagshuset/nestjs-mongoose-paginate';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
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
  IdDto,
} from '@nyp19vp-be/shared';
import { Types } from 'mongoose';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PkgMgmtService {
  constructor(
    @Inject('PKG_MGMT_SERVICE') private readonly packageMgmtClient: ClientKafka
  ) {}

  async createPkg(createPkgReqDto: CreatePkgReqDto): Promise<CreatePkgResDto> {
    return await firstValueFrom(
      this.packageMgmtClient.send(
        kafkaTopic.PACKAGE_MGMT.CREATE_PKG,
        createPkgReqDto
      )
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
    collectionDto: CollectionDto
  ): Promise<CollectionResponse<PackageDto>> {
    return await firstValueFrom(
      this.packageMgmtClient.send(
        kafkaTopic.PACKAGE_MGMT.GET_ALL_PKGS,
        collectionDto
      )
    );
  }
  async getPkgById(id: Types.ObjectId): Promise<GetPkgResDto> {
    return await firstValueFrom(
      this.packageMgmtClient.send(kafkaTopic.PACKAGE_MGMT.GET_PKG_BY_ID, id)
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
        updatePkgReqDto
      )
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
      this.packageMgmtClient.send(kafkaTopic.PACKAGE_MGMT.DELETE_PKG, id)
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
        createGrReqDto
      )
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
    collectionDto: CollectionDto
  ): Promise<CollectionResponse<GroupDto>> {
    return await firstValueFrom(
      this.packageMgmtClient.send(
        kafkaTopic.PACKAGE_MGMT.GET_ALL_GRS,
        collectionDto
      )
    );
  }
  async getGrById(id: Types.ObjectId): Promise<GetGrResDto> {
    return await firstValueFrom(
      this.packageMgmtClient.send(kafkaTopic.PACKAGE_MGMT.GET_GR_BY_ID, id)
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
        updatePkgReqDto
      )
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
      this.packageMgmtClient.send(kafkaTopic.PACKAGE_MGMT.DELETE_GR, id)
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
        updateGrMbReqDto
      )
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
        updateGrMbReqDto
      )
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
    updateGrPkgReqDto: UpdateGrPkgReqDto
  ): Promise<UpdateGrPkgResDto> {
    return await firstValueFrom(
      this.packageMgmtClient.send(
        kafkaTopic.PACKAGE_MGMT.RM_GR_PKG,
        updateGrPkgReqDto
      )
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
    updateGrPkgReqDto: UpdateGrPkgReqDto
  ): Promise<UpdateGrPkgResDto> {
    return await firstValueFrom(
      this.packageMgmtClient.send(
        kafkaTopic.PACKAGE_MGMT.ADD_GR_PKG,
        updateGrPkgReqDto
      )
    ).then((res) => {
      if (res.statusCode == HttpStatus.OK) return res;
      else
        throw new HttpException(res.message, res.statusCode, {
          cause: new Error(res.error),
          description: res.error,
        });
    });
  }
}
