import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  OnModuleInit,
  Inject,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import {
  kafkaTopic,
  LoginReqDto,
  LoginResDto,
  LogoutReqDto,
  LogoutResDto,
  RegisterReqDto,
  RegisterResDto,
} from '@nyp19vp-be/shared';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController implements OnModuleInit {
  constructor(
    private readonly authService: AuthService,
    @Inject('AUTH_SERVICE') private readonly authClient: ClientKafka
  ) {}
  async onModuleInit() {
    this.authClient.subscribeToResponseOf(kafkaTopic.HEALT_CHECK.AUTH);

    for (const key in kafkaTopic.AUTH) {
      this.authClient.subscribeToResponseOf(kafkaTopic.AUTH[key]);
    }

    await Promise.all([this.authClient.connect()]);
  }

  @Post('login')
  login(@Body() reqDto: LoginReqDto): LoginResDto {
    console.log('login', reqDto);

    return {
      status: 'success',
      msg: 'login success with user ' + reqDto.username,
      refreshToken: 'refreshToken123',
      accessToken: 'accessToken345',
    };
  }

  @Post('logout')
  logout(@Body() reqDto: LogoutReqDto): LogoutResDto {
    console.log('logout', reqDto);

    return;
  }

  @Post('register')
  register(@Body() reqDto: RegisterReqDto): Promise<RegisterResDto> {
    console.log('register', reqDto);

    return this.authService.register(reqDto);
  }
}
