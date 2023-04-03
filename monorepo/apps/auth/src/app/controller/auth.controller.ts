import { ValidateUserReqDto } from './../../../../../libs/shared/src/lib/dto/auth/authentication.dto';
import { Controller, Get, Inject } from '@nestjs/common';
import { OnModuleInit } from '@nestjs/common/interfaces';
import { ClientKafka, MessagePattern } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import {
  kafkaTopic,
  LoginReqDto,
  LoginResDto,
  RegisterReqDto,
  RegisterResDto,
} from '@nyp19vp-be/shared';

import { AccountService } from '../services/account.service';
import { ActionService } from '../services/action.service';
import { AuthService } from '../services/auth.service';
import { RefreshTokenBlacklistService } from '../services/refresh-token-blacklist.service';
import { RoleService } from '../services/role.service';

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
}
