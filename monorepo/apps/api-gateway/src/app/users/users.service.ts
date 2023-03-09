import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { CreateUserReqDto, CreateUserResDto, kafkaTopic, UpdateUserReqDto, UpdateUserResDto } from '@nyp19vp-be/shared';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UsersService {
    constructor(
        @Inject('USERS_SERVICE') private readonly usersClient: ClientKafka
    ) {}
    createUser(createUserReqDto: CreateUserReqDto): Promise<CreateUserResDto> {
        return firstValueFrom(
          this.usersClient.send(kafkaTopic.USERS.CREATE, createUserReqDto)
        );
    }
    updateUser(updateUserReqDto: UpdateUserReqDto): Promise<UpdateUserResDto> {
        return firstValueFrom(
            this.usersClient.send(kafkaTopic.USERS.UPDATE, updateUserReqDto)
        );
    }
}
