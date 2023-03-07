import { firstValueFrom } from 'rxjs';
import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserReqDto, kafkaTopic } from '@nyp19vp-be/shared';
import { ClientKafka, MessagePattern } from '@nestjs/microservices';
import { OnModuleInit } from '@nestjs/common/interfaces';
@Controller('users')
export class UsersController implements OnModuleInit {
  constructor(
    private readonly usersService: UsersService,
    @Inject('USERS_SERVICE') private readonly usersClient: ClientKafka
  ) {}

  async onModuleInit() {
    // this.usersClient.subscribeToResponseOf(kafkaTopic.HEALT_CHECK.USERS);
    // for (const key in kafkaTopic.USERS) {
    //   this.usersClient.subscribeToResponseOf(kafkaTopic.USERS[key]);
    // }
    // await Promise.all([this.usersClient.connect()]);
  }

  @Post()
  createUser(@Body() createUserReqDto: CreateUserReqDto) {
    return createUserReqDto;
  }

  @Get('healthcheck')
  async healthcheck() {
    // const res = await firstValueFrom(
    //   this.usersClient.send(kafkaTopic.HEALT_CHECK.USERS, {})
    // );
    // return res;
  }
}
