import {
  CollectionDto,
  CollectionResponse,
} from '@forlagshuset/nestjs-mongoose-paginate';
import { Controller, Inject, OnModuleInit } from '@nestjs/common';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';
import {
  CheckoutReqDto,
  CreateUserReqDto,
  CreateUserResDto,
  GetCartResDto,
  GetUserInfoResDto,
  GetUserSettingResDto,
  kafkaTopic,
  RenewGrPkgReqDto,
  UpdateAvatarReqDto,
  UpdateAvatarResDto,
  UpdateCartReqDto,
  UpdateCartResDto,
  UpdateSettingReqDto,
  UpdateSettingResDto,
  UpdateTrxHistReqDto,
  UpdateTrxHistResDto,
  UpdateUserReqDto,
  UpdateUserResDto,
  UserDto,
  ZPCheckoutResDto,
} from '@nyp19vp-be/shared';
import { UsersCrudService } from './users-crud.service';
import { Types } from 'mongoose';

@Controller()
export class UsersCrudController implements OnModuleInit {
  constructor(
    private readonly usersCrudService: UsersCrudService,
    @Inject('TXN_SERVICE') private readonly txnClient: ClientKafka,
    @Inject('PKG_MGMT_SERVICE') private readonly pkgClient: ClientKafka,
  ) {}

  async onModuleInit() {
    this.txnClient.subscribeToResponseOf(kafkaTopic.HEALT_CHECK.TXN);
    for (const key in kafkaTopic.TXN) {
      this.txnClient.subscribeToResponseOf(kafkaTopic.TXN[key]);
    }
    await Promise.all([this.txnClient.connect()]);

    this.pkgClient.subscribeToResponseOf(kafkaTopic.HEALT_CHECK.PACKAGE_MGMT);
    for (const key in kafkaTopic.PACKAGE_MGMT) {
      this.pkgClient.subscribeToResponseOf(kafkaTopic.PACKAGE_MGMT[key]);
    }
    await Promise.all([this.pkgClient.connect()]);
  }

  @MessagePattern(kafkaTopic.USERS.CREATE)
  create(
    @Payload() createUserReqDto: CreateUserReqDto,
  ): Promise<CreateUserResDto> {
    return this.usersCrudService.create(createUserReqDto);
  }

  @MessagePattern(kafkaTopic.USERS.GET_ALL)
  findAll(
    @Payload() collectionDto: CollectionDto,
  ): Promise<CollectionResponse<UserDto>> {
    return this.usersCrudService.findAll(collectionDto);
  }

  @MessagePattern(kafkaTopic.USERS.GET_INFO_BY_ID)
  findInfoById(@Payload() id: Types.ObjectId): Promise<GetUserInfoResDto> {
    return this.usersCrudService.findInfoById(id);
  }

  @MessagePattern(kafkaTopic.USERS.GET_INFO_BY_EMAIL)
  findInfoByEmail(@Payload() email: string): Promise<GetUserInfoResDto> {
    return this.usersCrudService.findInfoByEmail(email);
  }

  @MessagePattern(kafkaTopic.USERS.GET_SETTING_BY_ID)
  findSettingById(
    @Payload() id: Types.ObjectId,
  ): Promise<GetUserSettingResDto> {
    return this.usersCrudService.findSettingById(id);
  }

  @MessagePattern(kafkaTopic.USERS.UPDATE_INFO)
  updateInfo(
    @Payload() updateUserReqDto: UpdateUserReqDto,
  ): Promise<UpdateUserResDto> {
    return this.usersCrudService.updateInfo(updateUserReqDto);
  }

  @MessagePattern(kafkaTopic.USERS.UPDATE_SETTING)
  updateSetting(
    @Payload() updateSettingReqDto: UpdateSettingReqDto,
  ): Promise<UpdateSettingResDto> {
    return this.usersCrudService.updateSetting(updateSettingReqDto);
  }

  @MessagePattern(kafkaTopic.USERS.UPDATE_AVATAR)
  updateAvatar(
    @Payload() updateAvatarReqDto: UpdateAvatarReqDto,
  ): Promise<UpdateAvatarResDto> {
    return this.usersCrudService.updateAvatar(updateAvatarReqDto);
  }

  @MessagePattern(kafkaTopic.USERS.DELETE_USER)
  removeUser(@Payload() id: Types.ObjectId): Promise<CreateUserResDto> {
    return this.usersCrudService.removeUser(id);
  }

  @MessagePattern(kafkaTopic.USERS.RESTORE_USER)
  restoreUser(@Payload() id: Types.ObjectId): Promise<CreateUserResDto> {
    return this.usersCrudService.restoreUser(id);
  }

  @MessagePattern(kafkaTopic.USERS.UPDATE_CART)
  updateCart(
    @Payload() updateCartReqDto: UpdateCartReqDto,
  ): Promise<UpdateCartResDto> {
    return this.usersCrudService.updateCart(updateCartReqDto);
  }

  @MessagePattern(kafkaTopic.USERS.GET_CART)
  getCart(@Payload() id: Types.ObjectId): Promise<GetCartResDto> {
    return this.usersCrudService.getCart(id);
  }

  @MessagePattern(kafkaTopic.USERS.UPDATE_TRX)
  updateTrxHist(
    @Payload() updateTrxHistReqDto: UpdateTrxHistReqDto,
  ): Promise<UpdateTrxHistResDto> {
    return this.usersCrudService.updateTrxHist(updateTrxHistReqDto);
  }

  @MessagePattern(kafkaTopic.USERS.CHECKOUT)
  checkout(
    @Payload() checkoutReqDto: CheckoutReqDto,
  ): Promise<ZPCheckoutResDto> {
    console.log('users-svc : checkout');
    return this.usersCrudService.checkout(checkoutReqDto);
  }

  @MessagePattern(kafkaTopic.USERS.SEARCH_USER)
  searchUser(@Payload() keyword: string): Promise<UserDto[]> {
    return this.usersCrudService.searchUser(keyword);
  }

  @MessagePattern(kafkaTopic.USERS.RENEW_PKG)
  renewPkg(@Payload() renewGrPkgReqDto: RenewGrPkgReqDto): Promise<any> {
    return this.usersCrudService.renewPkg(renewGrPkgReqDto);
  }
}
