import { RegisterReqDto, RegisterResDto } from '@nyp19vp-be/shared';
import { AccountEntity } from './../entities/account.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(AccountEntity)
    private accountRespo: Repository<AccountEntity>,
  ) {}

  getData(): { message: string } {
    return { message: 'Welcome to auth/Account service!' };
  }

  async create(reqDto: RegisterReqDto): Promise<RegisterResDto> {
    const testAccount: AccountEntity = this.accountRespo.create({
      username: reqDto.username,
      hasedPassword: reqDto.password,
    });

    const saveResult = await this.accountRespo.save(testAccount);

    console.log(saveResult);

    return {
      status: saveResult ? 'success' : 'fail',
      msg: saveResult ? 'create account successfully' : 'create account fail',
    };
  }

  findAll() {
    return `This action returns all accounts`;
  }

  findOne(id: number) {
    return `This action returns an account`;
  }

  update() {
    return `This action updates an account`;
  }

  remove(id: number) {
    return `This action removes an account`;
  }
}
