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
import { catchError, firstValueFrom, Observable, throwError } from 'rxjs';
import { ClientKafka, RpcException } from '@nestjs/microservices';
import { BaseResDto } from 'libs/shared/src/lib/dto/base.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientKafka,
  ) {}

  async login(reqDto: LoginReqDto): Promise<any> {
    try {
      const temp = await firstValueFrom(
        this.authClient.send(
          kafkaTopic.AUTH.LOGIN,
          JSON.stringify({ body: reqDto }),
        ),
      );

      console.log('tem1p', temp);

      return {
        statusCode: 200,
        message: '@22222',
      };
    } catch (error) {
      console.log(error);

      return error;
    }
  }

  logout(reqDto: LogoutReqDto): Promise<LogoutResDto> {
    return firstValueFrom(
      this.authClient.send(kafkaTopic.AUTH.LOGOUT, JSON.stringify(reqDto)),
    );
  }

  register(reqDto: RegisterReqDto): Promise<RegisterResDto> {
    return firstValueFrom(
      this.authClient.send(kafkaTopic.AUTH.REGISTER, JSON.stringify(reqDto)),
    );
  }
}
