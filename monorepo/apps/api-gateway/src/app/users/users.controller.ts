import { firstValueFrom } from 'rxjs';
import { Body, Controller, Get, Inject, Param, Post, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserReqDto, CreateUserResDto, kafkaTopic, UpdateUserReqDto, UpdateUserResDto } from '@nyp19vp-be/shared';
import { ClientKafka, MessagePattern } from '@nestjs/microservices';
import { OnModuleInit } from '@nestjs/common/interfaces';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
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
  async create(@Body() createUserReqDto: CreateUserReqDto): Promise<CreateUserResDto> {
    console.log('createUser', createUserReqDto);

    return this.usersService.createUser(createUserReqDto);
  }

  @Put(':_id')
  @ApiOkResponse({ description: 'Updated User' })
  @ApiBadRequestResponse({ description: 'Bad Request Response'})
  async updateUser(@Param('_id') id: string, @Body() updateUserReqDto: UpdateUserReqDto): Promise<UpdateUserResDto> {
    console.log(`updateUser #${id}`, updateUserReqDto);
    updateUserReqDto._id = id
    return this.usersService.updateUser(updateUserReqDto);
  }

  @Get('healthcheck')
  async healthcheck() {
    // const res = await firstValueFrom(
    //   this.usersClient.send(kafkaTopic.HEALT_CHECK.USERS, {})
    // );
    // return res;
  }
}
