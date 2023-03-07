import { Controller, Inject } from '@nestjs/common';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';
import { AuthenticationService } from './authentication.service';
import { kafkaTopic, RegisterReqDto, RegisterResDto } from '@nyp19vp-be/shared';

@Controller()
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService,
    @Inject('USERS_SERVICE') private readonly usersClient: ClientKafka
  ) {}

  async onModuleInit() {
    this.usersClient.subscribeToResponseOf(kafkaTopic.HEALT_CHECK.USERS);

    // for (const key in kafkaTopic.USERS) {
    //   this.usersClient.subscribeToResponseOf(kafkaTopic.USERS[key]);
    // }

    await Promise.all([this.usersClient.connect()]);
  }

  @MessagePattern(kafkaTopic.AUTH.REGISTER)
  register(@Payload() reqDto: RegisterReqDto): Promise<RegisterResDto> {
    return this.authenticationService.register(reqDto);
  }
}
