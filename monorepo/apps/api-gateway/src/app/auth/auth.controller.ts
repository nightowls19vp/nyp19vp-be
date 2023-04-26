import { SWAGGER_BEARER_AUTH_REFRESH_TOKEN_NAME } from './../constants/authentication/index';
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
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { ClientKafka } from '@nestjs/microservices';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  kafkaTopic,
  LoginReqDto,
  LoginResDto,
  LoginResWithTokensDto,
  LogoutReqDto,
  LogoutResDto,
  CreateAccountReqDto,
  CreateAccountResDto,
  SocialSignupResDto,
} from '@nyp19vp-be/shared';

// import { AllGlobalExceptionsFilter } from '../filters/filter';
import { AuthService } from './auth.service';
import { GoogleAuthGuard } from './guards/google.guard';
import { SocialUser } from './decorators/social-user.decorator';
import { ISocialUser } from './interfaces/social-user.interface';
import { SocialAccountReqDto } from './dto/social-account.req.dto';
import { UserDto } from '@nyp19vp-be/shared';
import { AccessJwtAuthGuard, RefreshJwtAuthGuard } from './guards/jwt.guard';
import { SWAGGER_BEARER_AUTH_ACCESS_TOKEN_NAME } from '../constants/authentication';
import { getRefreshToken } from './utils/get-jwt-token';

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

  @Get('oauth2/google/:from')
  @UseGuards(GoogleAuthGuard)
  async googleAuth() {
    // this route empty
  }

  @Get('oauth2/google/:from/:accountId')
  @UseGuards(GoogleAuthGuard)
  async googleAuthLink() {
    // this route empty
  }

  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(
    @Req() req: Request,
    @Res() res: Response,
    @SocialUser() googleUser: ISocialUser,
  ) {
    if (!googleUser) {
      throw new UnauthorizedException();
    }

    console.log('gpai auth ctrl: reach redirect');
    const webUrl =
      req.params.from || process.env.WEB_URL || 'http://localhost:8080';

    const signupResDto: SocialSignupResDto =
      await this.authService.googleSignUp(googleUser);

    if (signupResDto.statusCode === HttpStatus.OK) {
      this.authService.setCookie(
        res,
        signupResDto.data.accessToken,
        signupResDto.data.refreshToken,
      );
    }
    res.redirect(webUrl);
  }

  @Post('create-social-account')
  async createSocialAccount(
    @Body() reqDto: SocialAccountReqDto,
  ): Promise<SocialSignupResDto> {
    console.log('createSocialAccount', reqDto);

    const resDto = await this.authService.googleSignUp(reqDto);

    console.log('resDto', resDto);

    if (!resDto) {
      throw new HttpException(
        'Cannot create social account',
        HttpStatus.BAD_REQUEST,
      );
    }
    return resDto;
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
      data: loginResWithTokensDto.data,
    };

    if (loginResDto.statusCode !== HttpStatus.OK) {
      throw new HttpException(loginResDto, loginResDto.statusCode);
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.json(loginResDto);
      res.end();
    }
  }

  @ApiResponse({
    description: 'response of login',
    type: LogoutResDto,
  })
  @Post('login/mobile')
  async loginMobile(
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

    const loginResDto: LoginResWithTokensDto = {
      statusCode: loginResWithTokensDto.statusCode,
      message: loginResWithTokensDto.message,
      accessToken: loginResWithTokensDto.accessToken,
      refreshToken: loginResWithTokensDto.refreshToken,
      data: loginResWithTokensDto.data,
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
  @ApiBearerAuth(SWAGGER_BEARER_AUTH_REFRESH_TOKEN_NAME)
  @UseGuards(RefreshJwtAuthGuard)
  async logout(
    @Req() req: Request,
    @Body() reqDto: LogoutReqDto,
  ): Promise<LogoutResDto> {
    const refreshToken = getRefreshToken(req) || reqDto.refreshToken || '';

    return this.authService.logout({
      refreshToken,
    });
  }

  @Post('register')
  register(@Body() reqDto: CreateAccountReqDto): Promise<CreateAccountResDto> {
    console.log('register', reqDto);

    return this.authService.register(reqDto);
  }

  @Get('validate')
  @ApiBearerAuth(SWAGGER_BEARER_AUTH_ACCESS_TOKEN_NAME)
  @UseGuards(AccessJwtAuthGuard)
  validate(@Req() req: Request): Express.User {
    return req.user;
  }

  @Get('refresh')
  @ApiBearerAuth(SWAGGER_BEARER_AUTH_REFRESH_TOKEN_NAME)
  @UseGuards(RefreshJwtAuthGuard)
  async refresh(@Req() req: Request) {
    const refreshToken = getRefreshToken(req) || '';

    console.log('refreshToken', refreshToken);

    return this.authService.refresh(refreshToken);
  }

  @Get('refresh/:token')
  @ApiBearerAuth(SWAGGER_BEARER_AUTH_REFRESH_TOKEN_NAME)
  @UseGuards(RefreshJwtAuthGuard)
  async refreshWithToken(@Req() req: Request, @Param('token') token: string) {
    const refreshToken = getRefreshToken(req) || token || '';

    console.log('refreshToken', refreshToken);

    return this.authService.refresh(refreshToken);
  }
}
