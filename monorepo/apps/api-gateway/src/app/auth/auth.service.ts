import {
  LoginReqDto,
  LoginResDto,
  LogoutReqDto,
  LogoutResDto,
  RegisterReqDto,
  RegisterResDto,
} from '@nyp19vp-be/shared';
import { kafkaTopic } from '@nyp19vp-be/shared';
import { Inject, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class AuthService {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientKafka
  ) {}

  login(reqDto: LoginReqDto): Promise<LoginResDto> {
    return firstValueFrom(this.authClient.send(kafkaTopic.AUTH.LOGIN, reqDto));
  }

  logout(reqDto: LogoutReqDto): Promise<LogoutResDto> {
    return firstValueFrom(this.authClient.send(kafkaTopic.AUTH.LOGOUT, reqDto));
  }

  register(reqDto: RegisterReqDto): Promise<RegisterResDto> {
    return firstValueFrom(
      this.authClient.send(kafkaTopic.AUTH.REGISTER, reqDto)
    );
  }
}
