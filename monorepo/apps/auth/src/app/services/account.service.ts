import { HttpStatus } from '@nestjs/common/enums';
import { RegisterReqDto, RegisterResDto } from '@nyp19vp-be/shared';
import { AccountEntity } from './../entities/account.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';

@Injectable()
export class AccountService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(AccountEntity)
    private accountRespo: Repository<AccountEntity>,
  ) {}

  getData(): { message: string } {
    return { message: 'Welcome to auth/Account service!' };
  }

  async create(reqDto: RegisterReqDto): Promise<RegisterResDto> {
    const account: AccountEntity = this.accountRespo.create({
      username: reqDto.username,
      hasedPassword: reqDto.password,
    });

    let saveResult = null;
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      saveResult = await this.accountRespo.save(account);

      // await send user profile to users service

      console.log(saveResult);
    } catch (error) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'create account fail',
        error: error.message,
      };
    }

    return {
      statusCode: saveResult ? HttpStatus.OK : HttpStatus.BAD_REQUEST,
      message: saveResult
        ? 'create account successfully'
        : 'create account fail',
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
