import { Request, Response } from 'express';

import {
  Body,
  Controller,
  HttpException,
  Inject,
  OnModuleInit,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { ClientKafka } from '@nestjs/microservices';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  kafkaTopic,
  LoginReqDto,
  LoginResDto,
  LoginResWithTokensDto,
  LogoutReqDto,
  LogoutResDto,
  RegisterReqDto,
  RegisterResDto,
} from '@nyp19vp-be/shared';

// import { AllGlobalExceptionsFilter } from '../filters/filter';
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

  @ApiResponse({
    description: 'response of login',
    type: LogoutResDto,
  })
  @Post('login')
  async login(
    @Body() reqDto: LoginReqDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    console.log('login', reqDto);

    const loginResWithTokensDto: LoginResWithTokensDto =
      await this.authService.login(reqDto);

    this.authService.setCookie(
      res,
      loginResWithTokensDto.accessToken,
      loginResWithTokensDto.refreshToken,
    );

    const loginResDto: LoginResDto = {
      statusCode: loginResWithTokensDto.statusCode,
      message: loginResWithTokensDto.message,
      accessToken: loginResWithTokensDto.accessToken,
    };

    if (loginResDto.statusCode !== HttpStatus.OK) {
      throw new HttpException(loginResDto, loginResDto.statusCode);
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.json(loginResDto);
      res.end();
    }
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
