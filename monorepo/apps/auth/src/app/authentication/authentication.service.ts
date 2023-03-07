import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { kafkaTopic, RegisterReqDto, RegisterResDto } from '@nyp19vp-be/shared';
import { firstValueFrom } from 'rxjs';
@Injectable()
export class AuthenticationService {
  constructor(
    @Inject('USERS_SERVICE') private readonly usersClient: ClientKafka
  ) {}
  async register(reqDto: RegisterReqDto): Promise<RegisterResDto> {
    console.log('auth-svc#register: ', reqDto);

    const res = await firstValueFrom(
      this.usersClient.send(kafkaTopic.HEALT_CHECK.USERS, {})
    );

    console.log('register: auth check users', res);

    return Promise.resolve({
      status: 'success',
      msg: `register user #${reqDto.username} successfully`,
    });
  }
}
