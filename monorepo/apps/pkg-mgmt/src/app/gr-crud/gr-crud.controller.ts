import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { GrCrudService } from './gr-crud.service';
import {
  AddGrMbReqDto,
  RmGrMbReqDto,
  CreateGrReqDto,
  GetGrResDto,
  GetGrsResDto,
  kafkaTopic,
  UpdateGrReqDto,
  UpdateGrPkgReqDto,
  GroupDto,
  UpdateAvatarReqDto,
  ActivateGrPkgReqDto,
  CheckGrSUReqDto,
  UpdateChannelReqDto,
  BaseResDto,
  PaginationParams,
  ProjectionParams,
} from '@nyp19vp-be/shared';
import {
  CollectionDto,
  CollectionResponse,
} from '@forlagshuset/nestjs-mongoose-paginate';
import { Types } from 'mongoose';

@Controller()
export class GrCrudController {
  constructor(private readonly grCrudService: GrCrudService) {}

  @MessagePattern(kafkaTopic.PKG_MGMT.GROUP.CREATE)
  create(@Payload() createGrReqDto: CreateGrReqDto): Promise<BaseResDto> {
    return this.grCrudService.create(createGrReqDto);
  }

  @MessagePattern(kafkaTopic.PKG_MGMT.GROUP.GET)
  find(
    @Payload() collectionDto: CollectionDto,
  ): Promise<CollectionResponse<GroupDto>> {
    return this.grCrudService.find(collectionDto);
  }

  @MessagePattern(kafkaTopic.PKG_MGMT.GROUP.GET_BY_ID)
  findById(
    @Payload() projectionParams: ProjectionParams,
  ): Promise<GetGrResDto> {
    return this.grCrudService.findById(projectionParams);
  }

  @MessagePattern(kafkaTopic.PKG_MGMT.GROUP.UPDATE)
  update(@Payload() updateGrReqDto: UpdateGrReqDto): Promise<BaseResDto> {
    return this.grCrudService.update(updateGrReqDto);
  }

  @MessagePattern(kafkaTopic.PKG_MGMT.GROUP.DELETE)
  remove(@Payload() id: Types.ObjectId): Promise<BaseResDto> {
    return this.grCrudService.remove(id);
  }

  @MessagePattern(kafkaTopic.PKG_MGMT.GROUP.RESTORE)
  restore(@Payload() id: Types.ObjectId): Promise<BaseResDto> {
    return this.grCrudService.restore(id);
  }

  @MessagePattern(kafkaTopic.PKG_MGMT.GROUP.ADD_MEMB)
  addMemb(@Payload() updateGrMbReqDto: AddGrMbReqDto): Promise<BaseResDto> {
    return this.grCrudService.addMemb(updateGrMbReqDto);
  }

  @MessagePattern(kafkaTopic.PKG_MGMT.GROUP.DEL_MEMB)
  rmMemb(@Payload() updateGrMbReqDto: RmGrMbReqDto): Promise<BaseResDto> {
    return this.grCrudService.rmMemb(updateGrMbReqDto);
  }

  @MessagePattern(kafkaTopic.PKG_MGMT.GROUP.ADD_PKG)
  addPkg(@Payload() updateGrPkgReqDto: UpdateGrPkgReqDto): Promise<BaseResDto> {
    return this.grCrudService.addPkg(updateGrPkgReqDto);
  }

  @MessagePattern(kafkaTopic.PKG_MGMT.GROUP.DEL_PKG)
  rmPkg(@Payload() updateGrPkgReqDto: UpdateGrPkgReqDto): Promise<BaseResDto> {
    return this.grCrudService.rmPkg(updateGrPkgReqDto);
  }

  @MessagePattern(kafkaTopic.PKG_MGMT.GROUP.GET_BY_USER)
  findByUser(
    @Payload() paginationParams: PaginationParams,
  ): Promise<GetGrsResDto> {
    return this.grCrudService.findByUser(paginationParams);
  }

  @MessagePattern(kafkaTopic.PKG_MGMT.GROUP.UPDATE_AVATAR)
  updateAvatar(
    @Payload() updateAvatarReqDto: UpdateAvatarReqDto,
  ): Promise<BaseResDto> {
    return this.grCrudService.updateAvatar(updateAvatarReqDto);
  }

  @MessagePattern(kafkaTopic.PKG_MGMT.GROUP.UPDATE_CHANNEL)
  updateChannel(
    @Payload() updateChannelReqDto: UpdateChannelReqDto,
  ): Promise<BaseResDto> {
    return this.grCrudService.updateChannel(updateChannelReqDto);
  }

  @MessagePattern(kafkaTopic.PKG_MGMT.GROUP.ACTIVATE_PKG)
  activatePkg(
    @Payload() activateGrPkgReqDto: ActivateGrPkgReqDto,
  ): Promise<BaseResDto> {
    return this.grCrudService.activatePkg(activateGrPkgReqDto);
  }

  @MessagePattern(kafkaTopic.PKG_MGMT.GROUP.IS_SU)
  isSU(@Payload() checkGrSUReqDto: CheckGrSUReqDto): Promise<boolean> {
    return this.grCrudService.isSU(checkGrSUReqDto);
  }
}
