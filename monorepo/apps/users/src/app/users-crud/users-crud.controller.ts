import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  CreateUserReqDto,
  CreateUserResDto,
  GetCartResDto,
  GetTrxHistResDto,
  GetUserInfoResDto,
  GetUserSettingResDto,
  GetUsersResDto,
  kafkaTopic,
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
} from '@nyp19vp-be/shared';
import { UsersCrudService } from './users-crud.service';

@Controller()
export class UsersCrudController {
  constructor(private readonly usersCrudService: UsersCrudService) {}

  @MessagePattern(kafkaTopic.USERS.CREATE)
  create(
    @Payload() createUserReqDto: CreateUserReqDto
  ): Promise<CreateUserResDto> {
    return this.usersCrudService.create(createUserReqDto);
  }

  @MessagePattern(kafkaTopic.USERS.GET_ALL)
  findAll(): Promise<GetUsersResDto> {
    return this.usersCrudService.findAll();
  }

  @MessagePattern(kafkaTopic.USERS.GET_INFO_BY_ID)
  findInfoById(@Payload() id: string): Promise<GetUserInfoResDto> {
    return this.usersCrudService.findInfoById(id);
  }

  @MessagePattern(kafkaTopic.USERS.GET_INFO_BY)
  findInfoBy(@Payload() option: string): Promise<GetUsersResDto> {
    return this.usersCrudService.findInfoBy(option);
  }

  @MessagePattern(kafkaTopic.USERS.GET_SETTING_BY_ID)
  findSettingById(@Payload() id: string): Promise<GetUserSettingResDto> {
    return this.usersCrudService.findSettingById(id);
  }

  @MessagePattern(kafkaTopic.USERS.UPDATE_INFO)
  updateInfo(
    @Payload() updateUserReqDto: UpdateUserReqDto
  ): Promise<UpdateUserResDto> {
    return this.usersCrudService.updateInfo(updateUserReqDto);
  }

  @MessagePattern(kafkaTopic.USERS.UPDATE_SETTING)
  updateSetting(
    @Payload() updateSettingReqDto: UpdateSettingReqDto
  ): Promise<UpdateSettingResDto> {
    return this.usersCrudService.updateSetting(updateSettingReqDto);
  }

  @MessagePattern(kafkaTopic.USERS.UPDATE_AVATAR)
  updateAvatar(
    @Payload() updateAvatarReqDto: UpdateAvatarReqDto
  ): Promise<UpdateAvatarResDto> {
    return this.usersCrudService.updateAvatar(updateAvatarReqDto);
  }

  @MessagePattern(kafkaTopic.USERS.DELETE_ONE)
  removeUser(@Payload() id: string): Promise<CreateUserResDto> {
    return this.usersCrudService.removeUser(id);
  }

  @MessagePattern(kafkaTopic.USERS.UPDATE_CART)
  updateCart(
    @Payload() updateCartReqDto: UpdateCartReqDto
  ): Promise<UpdateCartResDto> {
    return this.usersCrudService.updateCart(updateCartReqDto);
  }

  @MessagePattern(kafkaTopic.USERS.GET_CART)
  getCart(@Payload() id: string): Promise<GetCartResDto> {
    return this.usersCrudService.getCart(id);
  }

  @MessagePattern(kafkaTopic.USERS.GET_TRX)
  getTrxHist(@Payload() id: string): Promise<GetTrxHistResDto> {
    return this.usersCrudService.getTrxHist(id);
  }

  @MessagePattern(kafkaTopic.USERS.GET_TRX)
  updateTrxHist(
    @Payload() updateTrxHistReqDto: UpdateTrxHistReqDto
  ): Promise<UpdateTrxHistResDto> {
    return this.usersCrudService.updateTrxHist(updateTrxHistReqDto);
  }
}
