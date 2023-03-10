import { firstValueFrom } from 'rxjs';
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
  GetUserInfoResDto,
  GetUserSettingResDto,
  kafkaTopic,
  UpdateAvatarReqDto,
  UpdateAvatarResDto,
  UpdateSettingReqDto,
  UpdateSettingResDto,
  UpdateUserReqDto,
  UpdateUserResDto,
} from '@nyp19vp-be/shared';
import { ClientKafka, MessagePattern } from '@nestjs/microservices';
import { OnModuleInit } from '@nestjs/common/interfaces';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
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
  @ApiCreatedResponse({ description: 'Created User' })
  async create(
    @Body() createUserReqDto: CreateUserReqDto
  ): Promise<CreateUserResDto> {
    console.log('createUser', createUserReqDto);

    return this.usersService.createUser(createUserReqDto);
  }

  @Get()
  async getAll(@Req() req: Request) {
    console.log('get all users');

    return this.usersService.getAllUsers(req);
  }

  @Get(':_id')
  @ApiOkResponse({ description: 'Got User by Id' })
  async getUserInfoById(@Param('_id') id: string): Promise<GetUserInfoResDto> {
    console.log(`get user info #${id}`);
    return this.usersService.getUserInfoById(id);
  }

  @Get(':_id/setting')
  async getUserSettingById(
    @Param('_id') id: string
  ): Promise<GetUserSettingResDto> {
    console.log(`get user setting #${id}`);
    return this.usersService.getUserSettingById(id);
  }

  @Put(':_id')
  @ApiOkResponse({ description: 'Updated User' })
  @ApiBadRequestResponse({ description: 'Bad Request Response' })
  async updateUser(
    @Param('_id') id: string,
    @Body() updateUserReqDto: UpdateUserReqDto
  ): Promise<UpdateUserResDto> {
    console.log(`update user #${id}`, updateUserReqDto);
    updateUserReqDto._id = id;
    return this.usersService.updateUser(updateUserReqDto);
  }

  @Put(':_id/setting')
  @ApiOkResponse({ description: 'Updated User Setting' })
  @ApiBadRequestResponse({ description: 'Bad Request Response' })
  async updateSetting(
    @Param('_id') id: string,
    @Body() updateSettingReqDto: UpdateSettingReqDto
  ): Promise<UpdateSettingResDto> {
    console.log(`update user #${id}`, updateSettingReqDto);
    updateSettingReqDto._id = id;
    return this.usersService.updateSetting(updateSettingReqDto);
  }

  @Put(':_id/avatar')
  @ApiOkResponse({ description: 'Updated User Setting' })
  @ApiBadRequestResponse({ description: 'Bad Request Response' })
  async updateAvatar(
    @Param('_id') id: string,
    @Body() updateAvatarReqDto: UpdateAvatarReqDto
  ): Promise<UpdateAvatarResDto> {
    console.log(`update user #${id}`, updateAvatarReqDto);
    updateAvatarReqDto._id = id;
    return this.usersService.updateAvatar(updateAvatarReqDto);
  }

  @Patch(':_id')
  async deleteUser(@Param('_id') id: string): Promise<CreateUserResDto> {
    return this.usersService.deleteUser(id);
  }

  @Get('healthcheck')
  async healthcheck() {
    // const res = await firstValueFrom(
    //   this.usersClient.send(kafkaTopic.HEALT_CHECK.USERS, {})
    // );
    // return res;
  }
}
