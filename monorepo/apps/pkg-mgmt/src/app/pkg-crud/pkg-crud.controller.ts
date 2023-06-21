import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PkgCrudService } from './pkg-crud.service';
import {
  BaseResDto,
  CreatePkgReqDto,
  GetPkgResDto,
  IdDto,
  kafkaTopic,
  PackageDto,
  UpdatePkgReqDto,
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
  create(@Payload() createPkgReqDto: CreatePkgReqDto): Promise<BaseResDto> {
    return this.pkgCrudService.create(createPkgReqDto);
  }

  @MessagePattern(kafkaTopic.PKG_MGMT.PACKAGE.GET)
  find(
    @Payload() collectionDto: CollectionDto,
  ): Promise<CollectionResponse<PackageDto>> {
    return this.pkgCrudService.find(collectionDto);
  }

  @MessagePattern(kafkaTopic.PKG_MGMT.PACKAGE.GET_BY_ID)
  findById(@Payload() id: Types.ObjectId): Promise<GetPkgResDto> {
    return this.pkgCrudService.findById(id);
  }

  @MessagePattern(kafkaTopic.PKG_MGMT.PACKAGE.UPDATE)
  update(@Payload() updatePkgReqDto: UpdatePkgReqDto): Promise<BaseResDto> {
    return this.pkgCrudService.update(updatePkgReqDto);
  }

  @MessagePattern(kafkaTopic.PKG_MGMT.PACKAGE.DELETE)
  remove(@Payload() id: Types.ObjectId): Promise<BaseResDto> {
    return this.pkgCrudService.remove(id);
  }

  @MessagePattern(kafkaTopic.PKG_MGMT.PACKAGE.RESTORE)
  restore(@Payload() id: Types.ObjectId): Promise<BaseResDto> {
    return this.pkgCrudService.restore(id);
  }

  @MessagePattern(kafkaTopic.PKG_MGMT.PACKAGE.GET_MANY)
  async findMany(@Payload() list_id: IdDto[]): Promise<PackageDto[]> {
    return await this.pkgCrudService.findMany(list_id);
  }
}
