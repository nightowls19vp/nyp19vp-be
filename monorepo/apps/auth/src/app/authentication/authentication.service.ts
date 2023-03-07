import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { kafkaTopic, RegisterReqDto, RegisterResDto } from '@nyp19vp-be/shared';
import { Model } from 'mongoose';
import { firstValueFrom } from 'rxjs';
import { Account, AccountDocument } from '../../schemas/account.schema';
@Injectable()
export class AuthenticationService {
  constructor(
    @Inject('USERS_SERVICE') private readonly usersClient: ClientKafka,
    @InjectModel(Account.name) private accountModel: Model<AccountDocument>
  ) {}
  async register(reqDto: RegisterReqDto): Promise<RegisterResDto> {
    console.log('auth-svc#register: ', reqDto);
    const createdAccount = new this.accountModel({
      username: reqDto.username,
      hashPwd: reqDto.password,
    });
    await createdAccount.save();

    // const res = await firstValueFrom(
    //   this.usersClient.send(kafkaTopic.HEALT_CHECK.USERS, {})
    // );

    // console.log('register: auth check users', res);

    return Promise.resolve({
      status: 'success',
      msg: `register user #${reqDto.username} successfully`,
    });
  }
}
