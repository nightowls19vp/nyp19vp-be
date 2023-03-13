import { OnModuleInit } from '@nestjs/common/interfaces';
import { RoleService } from '../services/role.service';
import { RefreshTokenBlacklistService } from './../services/refresh-token-blacklist.service';
import { ActionService } from '../services/action.service';
import { AccountService } from '../services/account.service';
import {
  RegisterReqDto,
  RegisterResDto,
  kafkaTopic,
  LoginReqDto,
  LoginResDto,
} from '@nyp19vp-be/shared';
import { Controller, Get, Inject, UseFilters, UseGuards } from '@nestjs/common';

import { AuthService } from '../services/auth.service';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { ExceptionFilter } from '../filters/rpc-exception.filter';

@ApiTags('auth')
@Controller()
export class AuthController implements OnModuleInit {
  constructor(
    private readonly appService: AuthService,
    private readonly accountService: AccountService,
    private readonly roleService: RoleService,
    private readonly actionService: ActionService,
    private readonly refreshTokenBlacklistService: RefreshTokenBlacklistService,
    @Inject('USERS_SERVICE') private readonly usersClient: ClientKafka,
  ) {}

  async onModuleInit() {
    // this.usersClient.subscribeToResponseOf(kafkaTopic.HEALT_CHECK.USERS);
    for (const key in kafkaTopic.USERS) {
      this.usersClient.subscribeToResponseOf(kafkaTopic.USERS[key]);
    }
    await Promise.all([this.usersClient.connect()]);
  }

  @Get()
  getData() {
    return this.appService.getData();
  }

  // @UseFilters(new ExceptionFilter())
  @UseGuards(LocalAuthGuard)
  @MessagePattern(kafkaTopic.AUTH.LOGIN)
  async login(reqDto: LoginReqDto): Promise<LoginResDto> {
    console.log(reqDto);
    return {
      statusCode: 200,
      message: 'test',
    };
  }

  @MessagePattern(kafkaTopic.AUTH.REGISTER)
  async register(reqDto: RegisterReqDto): Promise<RegisterResDto> {
    console.log('MessagePattern(kafkaTopic.AUTH.REGISTER) ', reqDto);

    return this.accountService.create(reqDto);
  }
}
