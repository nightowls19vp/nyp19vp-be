import { ValidateUserReqDto } from './../../../../../libs/shared/src/lib/dto/auth/authentication.dto';
import { Controller, Get, HttpStatus, Inject } from '@nestjs/common';
import { OnModuleInit } from '@nestjs/common/interfaces';
import {
  ClientKafka,
  MessagePattern,
  RpcException,
} from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import {
  kafkaTopic,
  LoginReqDto,
  LoginResDto,
  RegisterReqDto,
  RegisterResDto,
  SocialSignupReqDto,
  SocialSignupResDto,
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
  async validateUser(reqDto: ValidateUserReqDto): Promise<LoginResDto> {
    return this.authService.validateUser(reqDto);
  }

  @MessagePattern(kafkaTopic.AUTH.LOGIN)
  async login(reqDto: LoginReqDto): Promise<LoginResDto> {
    return this.authService.login(reqDto);
  }

  @MessagePattern(kafkaTopic.AUTH.CREATE_ACCOUNT)
  async register(reqDto: RegisterReqDto): Promise<RegisterResDto> {
    console.log('MessagePattern(kafkaTopic.AUTH.CREATE_ACCOUNT) ', reqDto);

    return this.accountService.create(reqDto);
  }

  @MessagePattern(kafkaTopic.AUTH.SOCIAL_SIGN_UP)
  async socialSignup(reqDto: SocialSignupReqDto): Promise<SocialSignupResDto> {
    console.log('MessagePattern(kafkaTopic.AUTH.SOCIAL_SIGN_UP) ', reqDto);
    const resDto = await this.accountService.socialSignup(reqDto);

    if (resDto.statusCode === HttpStatus.CREATED) {
      const accessToken = this.authService.generateAccessJWT({
        user: {},
      });

      return {
        statusCode: loginResDto.statusCode,
        message: loginResDto.message,
        data: {
          accessToken: loginResDto.accessToken,
          refreshToken: loginResDto.refreshToken,
        },
      };
    } else {
      throw new RpcException(resDto);
    }
  }
}
