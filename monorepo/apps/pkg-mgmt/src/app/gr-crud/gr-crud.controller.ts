import { Controller, Inject } from '@nestjs/common';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';
import { GrCrudService } from './gr-crud.service';
import {
  AddGrMbReqDto,
  RmGrMbReqDto,
  UpdateGrMbResDto,
  CreateGrReqDto,
  CreateGrResDto,
  GetGrResDto,
  kafkaTopic,
  UpdateGrReqDto,
  UpdateGrResDto,
  UpdateGrPkgReqDto,
  UpdateGrPkgResDto,
  GroupDto,
  MemberDto,
  GetGrsByUserResDto,
  UpdateAvatarReqDto,
  UpdateAvatarResDto,
  ActivateGrPkgReqDto,
  ActivateGrPkgResDto,
  CheckGrSUReqDto,
  UpdateChannelReqDto,
  UpdateChannelResDto,
  GetGrChannelResDto,
  CreateBillReqDto,
  CreateBillResDto,
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

  @MessagePattern(kafkaTopic.PACKAGE_MGMT.CREATE_GR)
  createGr(@Payload() createGrReqDto: CreateGrReqDto): Promise<CreateGrResDto> {
    return this.grCrudService.createGr(createGrReqDto);
  }

  @MessagePattern(kafkaTopic.PACKAGE_MGMT.GET_ALL_GRS)
  findAllGrs(
    @Payload() collectionDto: CollectionDto,
  ): Promise<CollectionResponse<GroupDto>> {
    return this.grCrudService.findAllGrs(collectionDto);
  }

  @MessagePattern(kafkaTopic.PACKAGE_MGMT.GET_GR_BY_ID)
  findGrById(@Payload() id: Types.ObjectId): Promise<GetGrResDto> {
    return this.grCrudService.findGrById(id);
  }

  @MessagePattern(kafkaTopic.PACKAGE_MGMT.UPDATE_GR)
  updateGr(@Payload() updateGrReqDto: UpdateGrReqDto): Promise<UpdateGrResDto> {
    return this.grCrudService.updateGr(updateGrReqDto);
  }

  @MessagePattern(kafkaTopic.PACKAGE_MGMT.DELETE_GR)
  removeGr(@Payload() id: Types.ObjectId): Promise<CreateGrResDto> {
    return this.grCrudService.removeGr(id);
  }

  @MessagePattern(kafkaTopic.PACKAGE_MGMT.RESTORE_GR)
  restoreGr(@Payload() id: Types.ObjectId): Promise<CreateGrResDto> {
    return this.grCrudService.restoreGr(id);
  }

  @MessagePattern(kafkaTopic.PACKAGE_MGMT.ADD_GR_MEMB)
  addMemb(
    @Payload() updateGrMbReqDto: AddGrMbReqDto,
  ): Promise<UpdateGrMbResDto> {
    return this.grCrudService.addMemb(updateGrMbReqDto);
  }

  @MessagePattern(kafkaTopic.PACKAGE_MGMT.RM_GR_MEMB)
  rmMemb(@Payload() updateGrMbReqDto: RmGrMbReqDto): Promise<UpdateGrMbResDto> {
    return this.grCrudService.rmMemb(updateGrMbReqDto);
  }

  @MessagePattern(kafkaTopic.PACKAGE_MGMT.ADD_GR_PKG)
  addGrPkg(
    @Payload() updateGrPkgReqDto: UpdateGrPkgReqDto,
  ): Promise<UpdateGrPkgResDto> {
    return this.grCrudService.addGrPkg(updateGrPkgReqDto);
  }

  @MessagePattern(kafkaTopic.PACKAGE_MGMT.RM_GR_PKG)
  rmGrPkg(
    @Payload() updateGrPkgReqDto: UpdateGrPkgReqDto,
  ): Promise<UpdateGrPkgResDto> {
    return this.grCrudService.rmGrPkg(updateGrPkgReqDto);
  }

  @MessagePattern(kafkaTopic.PACKAGE_MGMT.GET_GRS_BY_USER)
  getGrByUserId(@Payload() memberDto: MemberDto): Promise<GetGrsByUserResDto> {
    return this.grCrudService.getGrByUserId(memberDto);
  }

  @MessagePattern(kafkaTopic.PACKAGE_MGMT.GET_GR_CHANNEL_BY_USER)
  getGrChannelByUserId(
    @Payload() id: Types.ObjectId,
  ): Promise<GetGrChannelResDto> {
    return this.grCrudService.getGrChannelByUserId(id);
  }

  @MessagePattern(kafkaTopic.PACKAGE_MGMT.UPDATE_GR_AVATAR)
  updateAvatar(
    @Payload() updateAvatarReqDto: UpdateAvatarReqDto,
  ): Promise<UpdateAvatarResDto> {
    return this.grCrudService.updateAvatar(updateAvatarReqDto);
  }

  @MessagePattern(kafkaTopic.PACKAGE_MGMT.UPDATE_GR_CHANNEL)
  updateChannel(
    @Payload() updateChannelReqDto: UpdateChannelReqDto,
  ): Promise<UpdateChannelResDto> {
    return this.grCrudService.updateChannel(updateChannelReqDto);
  }

  @MessagePattern(kafkaTopic.PACKAGE_MGMT.ACTIVATE_GR_PKG)
  activateGrPkg(
    @Payload() activateGrPkgReqDto: ActivateGrPkgReqDto,
  ): Promise<ActivateGrPkgResDto> {
    return this.grCrudService.activateGrPkg(activateGrPkgReqDto);
  }

  @MessagePattern(kafkaTopic.PACKAGE_MGMT.CHECK_GR_SU)
  checkGrSU(@Payload() checkGrSUReqDto: CheckGrSUReqDto): Promise<boolean> {
    return this.grCrudService.checkGrSU(checkGrSUReqDto);
  }

  @MessagePattern(kafkaTopic.PACKAGE_MGMT.CREATE_GR_BILL)
  createBill(
    @Payload() createBillReqDto: CreateBillReqDto,
  ): Promise<CreateBillResDto> {
    return this.grCrudService.createBill(createBillReqDto);
  }
}
