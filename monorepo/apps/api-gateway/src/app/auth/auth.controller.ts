import {
  Controller,
  Post,
  Body,
  OnModuleInit,
  Inject,
  UseFilters,
} from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { ClientKafka } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import {
  kafkaTopic,
  LoginReqDto,
  LoginResDto,
  LogoutReqDto,
  LogoutResDto,
  RegisterReqDto,
  RegisterResDto,
} from '@nyp19vp-be/shared';
import { AllGlobalExceptionsFilter } from '../filters/filter';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController implements OnModuleInit {
  constructor(
    private readonly authService: AuthService,
    @Inject('AUTH_SERVICE') private readonly authClient: ClientKafka,
  ) {}
  async onModuleInit() {
    // this.authClient.subscribeToResponseOf(kafkaTopic.HEALT_CHECK.AUTH);

    for (const key in kafkaTopic.AUTH) {
      this.authClient.subscribeToResponseOf(kafkaTopic.AUTH[key]);
    }

    await Promise.all([this.authClient.connect()]);
  }

  @Post('login')
  async login(@Body() reqDto: LoginReqDto) {
    console.log('login', reqDto);

    return this.authService.login(reqDto);

    return {
      statusCode: HttpStatus.OK,
      message: 'login success with user ' + reqDto.username,
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

  // @Get('authorize')
  // authorize()
}
