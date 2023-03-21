import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PkgCrudService } from './pkg-crud.service';
import {
  CreatePkgReqDto,
  CreatePkgResDto,
  GetPkgResDto,
  GetPkgsResDto,
  kafkaTopic,
  UpdatePkgReqDto,
  UpdatePkgResDto,
} from '@nyp19vp-be/shared';

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
  findAllPkgs(): Promise<GetPkgsResDto> {
    return this.pkgCrudService.findAllPkgs();
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
