import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
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
import { ClientKafka } from '@nestjs/microservices';
import { OnModuleInit } from '@nestjs/common/interfaces';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { Patch } from '@nestjs/common/decorators';

@Controller('users')
export class UsersController implements OnModuleInit {
  constructor(
    private readonly usersService: UsersService,
    @Inject('USERS_SERVICE') private readonly usersClient: ClientKafka
  ) {}

  async onModuleInit() {
    this.usersClient.subscribeToResponseOf(kafkaTopic.HEALT_CHECK.USERS);
    for (const key in kafkaTopic.USERS) {
      this.usersClient.subscribeToResponseOf(kafkaTopic.USERS[key]);
    }
    await Promise.all([this.usersClient.connect()]);
  }

  @Post()
  @ApiCreatedResponse({ description: 'Created User', type: CreateUserResDto })
  async create(
    @Body() createUserReqDto: CreateUserReqDto
  ): Promise<CreateUserResDto> {
    console.log('createUser', createUserReqDto);

    return this.usersService.createUser(createUserReqDto);
  }

  @Get()
  @ApiOkResponse({ description: 'Got All Users', type: GetUsersResDto })
  async getAll(@Req() req: Request): Promise<GetUsersResDto> {
    console.log('get all users');

    return this.usersService.getAllUsers(req);
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Got User by Id', type: GetUserInfoResDto })
  async getUserById(@Param('id') id: string): Promise<GetUserInfoResDto> {
    return this.usersService.getUserById(id);
  }

  @Get('/findByFilter/:option')
  @ApiOkResponse({
    description: 'Got User Setting by Partial<UserInfo>',
    type: GetUsersResDto,
  })
  async getUserBy(@Param('option') option: string): Promise<GetUsersResDto> {
    return this.usersService.getUserBy(option);
  }

  @Get(':id/setting')
  @ApiOkResponse({
    description: 'Got User Setting by Id',
    type: GetUserSettingResDto,
  })
  async getUserSettingById(
    @Param('id') id: string
  ): Promise<GetUserSettingResDto> {
    console.log(`get user setting #${id}`);
    return this.usersService.getUserSettingById(id);
  }

  @Put(':id')
  @ApiOkResponse({ description: 'Updated User', type: UpdateUserResDto })
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserReqDto: UpdateUserReqDto
  ): Promise<UpdateUserResDto> {
    console.log(`update user #${id}`, updateUserReqDto);
    updateUserReqDto._id = id;
    return this.usersService.updateUser(updateUserReqDto);
  }

  @Put(':id/setting')
  @ApiOkResponse({
    description: 'Updated User Setting',
    type: UpdateSettingResDto,
  })
  async updateSetting(
    @Param('id') id: string,
    @Body() updateSettingReqDto: UpdateSettingReqDto
  ): Promise<UpdateSettingResDto> {
    console.log(`update user #${id}`, updateSettingReqDto);
    updateSettingReqDto._id = id;
    return this.usersService.updateSetting(updateSettingReqDto);
  }

  @Put(':id/avatar')
  @ApiOkResponse({
    description: 'Updated User Setting',
    type: UpdateAvatarResDto,
  })
  async updateAvatar(
    @Param('id') id: string,
    @Body() updateAvatarReqDto: UpdateAvatarReqDto
  ): Promise<UpdateAvatarResDto> {
    console.log(`update user #${id}`, updateAvatarReqDto);
    updateAvatarReqDto._id = id;
    return this.usersService.updateAvatar(updateAvatarReqDto);
  }

  @Patch(':id')
  @ApiOkResponse({ description: 'Deleted user', type: CreateUserResDto })
  async deleteUser(@Param('id') id: string): Promise<CreateUserResDto> {
    return this.usersService.deleteUser(id);
  }

  @Put(':id/cart')
  @ApiOkResponse({
    description: 'Updated shopping cart',
    type: UpdateCartResDto,
  })
  async updateCart(
    @Param('id') id: string,
    @Body() updateCartReqDto: UpdateCartReqDto
  ): Promise<UpdateCartResDto> {
    console.log(`update items of user #${id}'s cart`, updateCartReqDto);
    updateCartReqDto._id = id;
    return this.usersService.updateCart(updateCartReqDto);
  }

  @Get(':id/cart')
  @ApiOkResponse({ description: 'Got shopping cart', type: GetCartResDto })
  async getCart(@Param('id') id: string): Promise<GetCartResDto> {
    console.log(`get items of user #${id}'s cart`);
    return this.usersService.getCart(id);
  }

  @Get(':id/trx')
  @ApiOkResponse({ description: 'Get transaction history' })
  async getTrxHist(@Param('id') id: string): Promise<GetTrxHistResDto> {
    console.log(`get transaction history of from user #${id}`);
    return this.usersService.getTrxHist(id);
  }

  @Put(':id/trx')
  @ApiOkResponse({ description: 'Get transaction history' })
  async updateTrxHist(
    @Param('id') id: string,
    @Body() updateTrxHistReqDto: UpdateTrxHistReqDto
  ): Promise<UpdateTrxHistResDto> {
    console.log(`update transaction history of from user #${id}`);
    updateTrxHistReqDto._id = id;
    return this.usersService.updateTrxHist(updateTrxHistReqDto);
  }

  @Get('healthcheck')
  async healthcheck() {
    // const res = await firstValueFrom(
    //   this.usersClient.send(kafkaTopic.HEALT_CHECK.USERS, {})
    // );
    // return res;
  }
}
