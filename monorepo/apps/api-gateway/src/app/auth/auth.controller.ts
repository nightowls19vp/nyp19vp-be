import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import {
  LoginReqDto,
  LoginResDto,
  LogoutReqDto,
  LogoutResDto,
  RegisterReqDto,
} from '@nyp19vp-be/shared';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() loginReqDto: LoginReqDto): LoginResDto {
    console.log('login', loginReqDto);

    return {
      status: 'success',
      msg: 'login success with user ' + loginReqDto.username,
      data: {},
    };
  }

  @Post('logout')
  logout(@Body() logoutResDto: LogoutReqDto) {
    console.log('logout', logoutResDto);

    return logoutResDto;
  }

  @Post('register')
  register(@Body() registerReqDto: RegisterReqDto) {
    console.log('register', registerReqDto);

    return registerReqDto;
  }
}
