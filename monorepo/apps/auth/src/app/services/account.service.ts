import { CreateUserReqDto, CreateUserResDto, ERole } from '@nyp19vp-be/shared';
import { firstValueFrom } from 'rxjs';
import { HttpStatus } from '@nestjs/common/enums';
import { kafkaTopic, RegisterReqDto, RegisterResDto } from '@nyp19vp-be/shared';
import { AccountEntity } from './../entities/account.entity';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { ClientKafka } from '@nestjs/microservices';

import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { RandomGenerator } from 'typeorm/util/RandomGenerator';
import { RoleEntity } from '../entities/role.entity';
import { log } from 'console';

@Injectable()
export class AccountService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(AccountEntity)
    private accountRespo: Repository<AccountEntity>,
    @InjectRepository(AccountEntity)
    private roleRespo: Repository<RoleEntity>,
    @Inject('USERS_SERVICE') private readonly usersClient: ClientKafka,
  ) {
    // create admin
    this.createAdmin();
  }

  async createAdmin() {
    const roleAdmin = this.roleRespo.create({
      name: ERole.admin,
    });

    const account: AccountEntity = this.accountRespo.create({
      username: process.env.ADMIN_USERNAME || 'admin',
      hashedPassword: process.env.ADMIN_PASSWORD || 'admin',
      email: process.env.ADMIN_EMAIL || 'admin',
      role: roleAdmin,
    });

    try {
      await this.accountRespo.save(account);
    } catch (error) {
      console.log(error);
    }

    console.log('[AUTH-SVC] create admin successfully', account);
  }

  getData(): { message: string } {
    return { message: 'Welcome to auth/Account service!' };
  }

  async create(reqDto: RegisterReqDto): Promise<RegisterResDto> {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(reqDto.password, salt);

    reqDto.password = hash;

    const roleUser = await this.roleRespo.findOneBy({
      name: ERole.user,
    });

    const account: AccountEntity = this.accountRespo.create({
      username: reqDto.username,
      hashedPassword: reqDto.password,
      email: reqDto.email,
      role: roleUser,
    });

    let saveResult = null;
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      saveResult = await queryRunner.manager.save<AccountEntity>(account);
      // await send user profile to users service
      const createUserReq: CreateUserReqDto = {
        email: reqDto.username,
        dob: reqDto.dob,
        name: reqDto.name,
        phone: reqDto.phone,
      };
      const createUserRes: CreateUserResDto = await firstValueFrom(
        this.usersClient.send(
          kafkaTopic.USERS.CREATE,
          JSON.stringify(createUserReq),
        ),
      );

      console.log('createUserRes', createUserRes);

      if (createUserRes.error) {
        console.log('roll back');

        throw new Error(createUserRes.error);
      }

      console.log(saveResult);
      await queryRunner.commitTransaction();
      return {
        statusCode: saveResult ? HttpStatus.OK : HttpStatus.BAD_REQUEST,
        message: saveResult
          ? 'create account successfully'
          : 'create account fail',
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'create account fail',
        error: error.message,
      };
    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release();
    }
  }

  findAll() {
    return `This action returns all accounts`;
  }

  async findOneBy(option): Promise<AccountEntity> {
    return this.accountRespo.findOneBy(option);
  }

  update() {
    return `This action updates an account`;
  }

  remove(id: number) {
    return `This action removes an account`;
  }

  socialSignup(user: any) {
    //
  }
}
