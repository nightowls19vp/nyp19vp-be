import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PkgCrudService } from './pkg-crud.service';
import {
  CreatePkgReqDto,
  CreatePkgResDto,
  GetPkgResDto,
  IdDto,
  kafkaTopic,
  PackageDto,
  UpdatePkgReqDto,
  UpdatePkgResDto,
} from '@nyp19vp-be/shared';
import {
  CollectionDto,
  CollectionResponse,
} from '@forlagshuset/nestjs-mongoose-paginate';
import { Types } from 'mongoose';

@Controller()
export class PkgCrudController {
  constructor(private readonly pkgCrudService: PkgCrudService) {}

  @MessagePattern(kafkaTopic.PKG_MGMT.PACKAGE.CREATE)
  createPkg(
    @Payload() createPkgReqDto: CreatePkgReqDto,
  ): Promise<CreatePkgResDto> {
    return this.pkgCrudService.createPkg(createPkgReqDto);
  }

  @MessagePattern(kafkaTopic.PKG_MGMT.PACKAGE.GET)
  findAllPkgs(
    @Payload() collectionDto: CollectionDto,
  ): Promise<CollectionResponse<PackageDto>> {
    return this.pkgCrudService.findAllPkgs(collectionDto);
  }

  @MessagePattern(kafkaTopic.PKG_MGMT.PACKAGE.GET_BY_ID)
  findPkgById(@Payload() id: Types.ObjectId): Promise<GetPkgResDto> {
    return this.pkgCrudService.findPkgById(id);
  }

  @MessagePattern(kafkaTopic.PKG_MGMT.PACKAGE.UPDATE)
  updatePkg(
    @Payload() updatePkgReqDto: UpdatePkgReqDto,
  ): Promise<UpdatePkgResDto> {
    return this.pkgCrudService.updatePkg(updatePkgReqDto);
  }

  @MessagePattern(kafkaTopic.PKG_MGMT.PACKAGE.DELETE)
  removePkg(@Payload() id: Types.ObjectId): Promise<CreatePkgResDto> {
    return this.pkgCrudService.removePkg(id);
  }

  @MessagePattern(kafkaTopic.PKG_MGMT.PACKAGE.RESTORE)
  restorePkg(@Payload() id: Types.ObjectId): Promise<CreatePkgResDto> {
    return this.pkgCrudService.restorePkg(id);
  }

  @MessagePattern(kafkaTopic.PKG_MGMT.PACKAGE.GET_MANY)
  async findManyPkg(@Payload() list_id: IdDto[]): Promise<PackageDto[]> {
    return await this.pkgCrudService.findManyPkg(list_id);
  }
}
