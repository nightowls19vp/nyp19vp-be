import { firstValueFrom } from 'rxjs';
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  NotFoundException,
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
  UpdateUserReqDto,
  UpdateUserResDto,
} from '@nyp19vp-be/shared';
import { ClientKafka, MessagePattern } from '@nestjs/microservices';
import { OnModuleInit } from '@nestjs/common/interfaces';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { Patch } from '@nestjs/common/decorators';

@Controller('users')
export class UsersController implements OnModuleInit {
  constructor(
    private readonly usersService: UsersService,
    @Inject('USERS_SERVICE') private readonly usersClient: ClientKafka,
  ) {}

  async onModuleInit() {
    // this.usersClient.subscribeToResponseOf(kafkaTopic.HEALT_CHECK.USERS);
    // for (const key in kafkaTopic.USERS) {
    //   this.usersClient.subscribeToResponseOf(kafkaTopic.USERS[key]);
    // }
    await Promise.all([this.usersClient.connect()]);
  }

  @Post()
  @ApiCreatedResponse({ description: 'Created User', type: CreateUserResDto })
  async create(
    @Body() createUserReqDto: CreateUserReqDto,
  ): Promise<CreateUserResDto> {
    console.log('createUser', createUserReqDto);

    return this.usersService.createUser(createUserReqDto);
  }

  @Get()
  @ApiOkResponse({ description: 'Got All Users', type: GetUsersResDto })
  async getAll(@Req() req: Request): Promise<GetUsersResDto> {
    console.log('get all users');

    const res = await this.usersService.getAllUsers(req);
    if (res.statusCode == HttpStatus.OK) {
      return res;
    } else {
      throw new NotFoundException('NOT FOUND', {
        cause: new Error(),
        description: res.message,
      });
    }
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Got User by Id', type: GetUserInfoResDto })
  async getUserInfoById(@Param('id') id: string): Promise<GetUserInfoResDto> {
    const res = await this.usersService.getUserInfoById(id);
    if (res.statusCode == HttpStatus.OK) {
      return res;
    } else {
      throw new NotFoundException('NOT FOUND', {
        cause: new Error(),
        description: res.message,
      });
    }
  }

  @Get(':id/setting')
  @ApiOkResponse({
    description: 'Got User Setting by Id',
    type: GetUserSettingResDto,
  })
  async getUserSettingById(
    @Param('id') id: string,
  ): Promise<GetUserSettingResDto> {
    console.log(`get user setting #${id}`);
    const res = await this.usersService.getUserSettingById(id);
    if (res.statusCode == HttpStatus.OK) {
      return res;
    } else {
      throw new NotFoundException('NOT FOUND', {
        cause: new Error(),
        description: res.message,
      });
    }
  }

  @Put(':id')
  @ApiOkResponse({ description: 'Updated User', type: UpdateUserResDto })
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserReqDto: UpdateUserReqDto,
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
    @Body() updateSettingReqDto: UpdateSettingReqDto,
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
    @Body() updateAvatarReqDto: UpdateAvatarReqDto,
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
    @Body() updateCartReqDto: UpdateCartReqDto,
  ): Promise<UpdateCartResDto> {
    console.log(`update items of user #${id}'s cart`, updateCartReqDto);
    updateCartReqDto._id = id;
    return this.usersService.updateCart(updateCartReqDto);
  }

  @Get(':id/cart')
  @ApiOkResponse({ description: 'Got shopping cart', type: GetCartResDto })
  async getCart(@Param('id') id: string): Promise<GetCartResDto> {
    console.log(`get items of user #${id}'s cart`);
    const res = await this.usersService.getCart(id);
    if (res.statusCode == HttpStatus.OK) {
      return res;
    } else {
      throw new NotFoundException('NOT FOUND', {
        cause: new Error(),
        description: res.message,
      });
    }
  }

  @Get('healthcheck')
  async healthcheck() {
    // const res = await firstValueFrom(
    //   this.usersClient.send(kafkaTopic.HEALT_CHECK.USERS, {})
    // );
    // return res;
  }
}
