import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PkgCrudService } from './pkg-crud.service';
import {
  CreatePkgReqDto,
  CreatePkgResDto,
  GetPkgResDto,
  kafkaTopic,
  PackageDto,
  UpdatePkgReqDto,
  UpdatePkgResDto,
} from '@nyp19vp-be/shared';
import {
  CollectionDto,
  CollectionResponse,
} from '@forlagshuset/nestjs-mongoose-paginate';

@Controller()
export class PkgCrudController {
  constructor(private readonly pkgCrudService: PkgCrudService) {}

  @MessagePattern(kafkaTopic.PACKAGE_MGMT.CREATE_PKG)
  createPkg(
    @Payload() createPkgReqDto: CreatePkgReqDto
  ): Promise<CreatePkgResDto> {
    return this.pkgCrudService.createPkg(createPkgReqDto);
  }

  @MessagePattern(kafkaTopic.PACKAGE_MGMT.GET_ALL_PKGS)
  findAllPkgs(
    collectionDto: CollectionDto
  ): Promise<CollectionResponse<PackageDto>> {
    return this.pkgCrudService.findAllPkgs(collectionDto);
  }

  @MessagePattern(kafkaTopic.PACKAGE_MGMT.GET_PKG_BY_ID)
  findPkgById(@Payload() id: string): Promise<GetPkgResDto> {
    return this.pkgCrudService.findPkgById(id);
  }

  @MessagePattern(kafkaTopic.PACKAGE_MGMT.UPDATE_PKG)
  updatePkg(
    @Payload() updatePkgReqDto: UpdatePkgReqDto
  ): Promise<UpdatePkgResDto> {
    return this.pkgCrudService.updatePkg(updatePkgReqDto);
  }

  @MessagePattern(kafkaTopic.PACKAGE_MGMT.DELETE_PKG)
  removePkg(@Payload() id: string): Promise<CreatePkgResDto> {
    return this.pkgCrudService.removePkg(id);
  }
}
