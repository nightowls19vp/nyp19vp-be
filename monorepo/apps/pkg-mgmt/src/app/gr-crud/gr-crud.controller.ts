import { Controller, Inject } from '@nestjs/common';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';
import { GrCrudService } from './gr-crud.service';
import {
  AddGrMbReqDto,
  RmGrMbReqDto,
  CreateGrReqDto,
  GetGrResDto,
  kafkaTopic,
  UpdateGrReqDto,
  UpdateGrPkgReqDto,
  GroupDto,
  MemberDto,
  GetGrsByUserResDto,
  UpdateAvatarReqDto,
  ActivateGrPkgReqDto,
  CheckGrSUReqDto,
  UpdateChannelReqDto,
  GetGrChannelResDto,
  BaseResDto,
} from '@nyp19vp-be/shared';
import {
  CollectionDto,
  CollectionResponse,
} from '@forlagshuset/nestjs-mongoose-paginate';
import { Types } from 'mongoose';

@Controller()
export class GrCrudController {
  constructor(
    private readonly grCrudService: GrCrudService,
    @Inject('USERS_SERVICE') private readonly usersClient: ClientKafka,
  ) {}

  async onModuleInit() {
    this.usersClient.subscribeToResponseOf(kafkaTopic.HEALT_CHECK.USERS);
    for (const key in kafkaTopic.USERS) {
      this.usersClient.subscribeToResponseOf(kafkaTopic.USERS[key]);
    }
    await Promise.all([this.usersClient.connect()]);
  }

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
  findById(@Payload() id: Types.ObjectId): Promise<GetGrResDto> {
    return this.grCrudService.findById(id);
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
  findByUser(@Payload() memberDto: MemberDto): Promise<GetGrsByUserResDto> {
    return this.grCrudService.findByUser(memberDto);
  }

  @MessagePattern(kafkaTopic.PKG_MGMT.GROUP.GET_CHANNEL_BY_USER)
  getChannelByUser(@Payload() id: Types.ObjectId): Promise<GetGrChannelResDto> {
    return this.grCrudService.getChannelByUser(id);
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
