import { Controller, Get, HttpStatus, Inject } from '@nestjs/common';
import { OnModuleInit } from '@nestjs/common/interfaces';
import {
  ClientKafka,
  MessagePattern,
  Payload,
  RpcException,
} from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import {
  kafkaTopic,
  LoginReqDto,
  LoginResDto,
  CreateAccountReqDto,
  CreateAccountResDto,
  SocialSignupReqDto,
  SocialSignupResDto,
  LogoutReqDto,
  LogoutResDto,
  ValidateUserReqDto,
  ValidateUserResDto,
  RefreshTokenReqDto,
  RefreshTokenResDto,
} from '@nyp19vp-be/shared';

import { AccountService } from '../services/account.service';
import { ActionService } from '../services/action.service';
import { AuthService } from '../services/auth.service';
import { RefreshTokenBlacklistService } from '../services/refresh-token-blacklist.service';
import { RoleService } from '../services/role.service';
import { randomUUID } from 'crypto';

@ApiTags('auth')
@Controller()
export class AuthController implements OnModuleInit {
  constructor(
    private readonly authService: AuthService,
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
    return this.authService.getData();
  }

  @MessagePattern(kafkaTopic.AUTH.VALIDATE_USER)
  async validateUser(reqDto: ValidateUserReqDto): Promise<ValidateUserResDto> {
    return this.authService.validateUser(reqDto);
  }

  @MessagePattern(kafkaTopic.AUTH.LOGIN)
  async login(reqDto: LoginReqDto): Promise<LoginResDto> {
    return this.authService.login(reqDto);
  }

  @MessagePattern(kafkaTopic.AUTH.LOGOUT)
  async logout(@Payload() reqDto: LogoutReqDto): Promise<LogoutResDto> {
    return this.authService.logout(reqDto.refreshToken);
  }

  @MessagePattern(kafkaTopic.AUTH.CREATE_ACCOUNT)
  async register(reqDto: CreateAccountReqDto): Promise<CreateAccountResDto> {
    console.log('MessagePattern(kafkaTopic.AUTH.CREATE_ACCOUNT) ', reqDto);

    return this.accountService.create(reqDto);
  }

  @MessagePattern(kafkaTopic.AUTH.SOCIAL_SIGN_UP)
  async socialSignup(reqDto: SocialSignupReqDto): Promise<SocialSignupResDto> {
    console.log('MessagePattern(kafkaTopic.AUTH.SOCIAL_SIGN_UP) ', reqDto);
    const resDto = await this.accountService.socialSignup(reqDto);

    return resDto;
  }

  @MessagePattern(kafkaTopic.AUTH.REFRESH)
  async refresh(
    @Payload() reqDto: RefreshTokenReqDto,
  ): Promise<RefreshTokenResDto> {
    return this.authService.refresh(reqDto.refreshToken);
  }
}
