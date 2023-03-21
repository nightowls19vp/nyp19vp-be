import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import {
  UpdateGrMbReqDto,
  UpdateGrMbResDto,
  CreateGrReqDto,
  CreateGrResDto,
  CreatePkgReqDto,
  CreatePkgResDto,
  GetGrResDto,
  GetGrsResDto,
  GetPkgResDto,
  GetPkgsResDto,
  kafkaTopic,
  UpdateGrReqDto,
  UpdateGrResDto,
  UpdatePkgReqDto,
  UpdatePkgResDto,
  UpdateGrPkgResDto,
  UpdateGrPkgReqDto,
} from '@nyp19vp-be/shared';
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

  async getAllPkg(req: Request): Promise<GetPkgsResDto> {
    return await firstValueFrom(
      this.packageMgmtClient.send(kafkaTopic.PACKAGE_MGMT.GET_ALL_PKGS, req)
    ).then((res) => {
      if (res.statusCode == HttpStatus.OK) return res;
      else
        throw new HttpException(res.message, res.statusCode, {
          cause: new Error(res.error),
          description: res.error,
        });
    });
  }
  async getPkgById(id: string): Promise<GetPkgResDto> {
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
  async deletePkg(id: string): Promise<CreatePkgResDto> {
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
  async getAllGr(req: Request): Promise<GetGrsResDto> {
    return await firstValueFrom(
      this.packageMgmtClient.send(kafkaTopic.PACKAGE_MGMT.GET_ALL_GRS, req)
    ).then((res) => {
      if (res.statusCode == HttpStatus.OK) return res;
      else
        throw new HttpException(res.message, res.statusCode, {
          cause: new Error(res.error),
          description: res.error,
        });
    });
  }
  async getGrById(id: string): Promise<GetGrResDto> {
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
  async deleteGr(id: string): Promise<CreateGrResDto> {
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
  async addGrMemb(
    updateGrMbReqDto: UpdateGrMbReqDto
  ): Promise<UpdateGrMbResDto> {
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
  async rmGrMemb(
    updateGrMbReqDto: UpdateGrMbReqDto
  ): Promise<UpdateGrMbResDto> {
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
