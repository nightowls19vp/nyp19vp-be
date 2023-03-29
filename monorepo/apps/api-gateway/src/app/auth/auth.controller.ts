import { Request, Response } from 'express';

import {
  Body,
  Controller,
  Get,
  HttpException,
  Inject,
  OnModuleInit,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
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
import { AuthGuard } from '@nestjs/passport';
import { GoogleAuthGuard } from './guards/google.guard';

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

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth(@Req() req) {
    // this route empty
  }

  @Get('google-logins/:from')
  @UseGuards(GoogleAuthGuard)
  async googleLogin(@Req() req: Request) {
    // this route empty
  }

  @Get('google/:from')
  @UseGuards(GoogleAuthGuard)
  async googleAuthFrom(@Req() req, @Param('from') from) {
    //
  }

  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    const auth = this.authService.googleLogin(req);

    return auth;

    const webUrl = process.env.WEB_URL || 'http://localhost:8080';

    this.authService.setCookie(res, 'aaaa', 'bbbb');

    res.cookie('aaa', JSON.stringify(auth));

    res.redirect(webUrl);
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
