import { RoleService } from '../services/role.service';
import { RefreshTokenBlacklistService } from './../services/refresh-token-blacklist.service';
import { ActionService } from '../services/action.service';
import { AccountService } from '../services/account.service';
import { RegisterReqDto, RegisterResDto, kafkaTopic } from '@nyp19vp-be/shared';
import { Controller, Get } from '@nestjs/common';

import { AuthService } from '../services/auth.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class AuthController {
  constructor(
    private readonly appService: AuthService,
    private readonly accountService: AccountService,
    private readonly roleService: RoleService,
    private readonly actionService: ActionService,
    private readonly refreshTokenBlacklistService: RefreshTokenBlacklistService,
  ) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  @MessagePattern(kafkaTopic.HEALT_CHECK.AUTH)
  healthcheck() {
    return 'ok  ';
  }
  @MessagePattern(kafkaTopic.AUTH.REGISTER)
  async register(reqDto: any): Promise<RegisterResDto> {
    console.log('MessagePattern(kafkaTopic.AUTH.REGISTER) ', reqDto);

    return this.accountService.create(reqDto);
  }
}
