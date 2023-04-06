import {
  CreateUserReqDto,
  CreateUserResDto,
  ERole,
  SocialSignupReqDto,
  SocialSignupResDto,
} from '@nyp19vp-be/shared';
import { firstValueFrom } from 'rxjs';
import { HttpStatus } from '@nestjs/common/enums';
import {
  kafkaTopic,
  CreateAccountReqDto,
  CreateAccountResDto,
} from '@nyp19vp-be/shared';
import { AccountEntity } from './../entities/account.entity';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { ClientKafka } from '@nestjs/microservices';

import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { RoleEntity } from '../entities/role.entity';
import { E_STATUS, StatusEntity } from '../entities/status.entity';
import { SocialAccountEntity } from '../entities/social-media-account.entity';
import { AuthService } from './auth.service';
import { platform } from 'os';

@Injectable()
export class AccountService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(AccountEntity)
    private accountRepo: Repository<AccountEntity>,
    @InjectRepository(StatusEntity)
    private statusRepo: Repository<StatusEntity>,
    @InjectRepository(RoleEntity)
    private roleRepo: Repository<RoleEntity>,
    @InjectRepository(SocialAccountEntity)
    private socialAccRepo: Repository<SocialAccountEntity>,

    private readonly authService: AuthService,

    @Inject('USERS_SERVICE') private readonly usersClient: ClientKafka,
  ) {
    // create admin
    this.createAdmin();
  }

  async createAdmin() {
    const roleAdmin = this.roleRepo.create({
      roleName: ERole.admin,
    });

    const username = process.env.ADMIN_USERNAME || 'admin',
      hashedPassword = process.env.ADMIN_PASSWORD || 'admin',
      email = process.env.ADMIN_EMAIL || 'admin@email.com';

    let account = await this.accountRepo.findOneBy({
      username: username,
    });

    if (account) {
      return;
    }

    account = this.accountRepo.create({
      username: username,
      hashedPassword: hashedPassword,
      email: email,
      role: roleAdmin,
      status: {
        name: E_STATUS.ACTIVE,
      },
    });

    try {
      account = await this.accountRepo.save(account);
    } catch (error) {
      console.log(error);
    }

    console.log('[AUTH-SVC] create admin successfully', account);
  }

  getData(): { message: string } {
    return { message: 'Welcome to auth/Account service!' };
  }

  async create(
    reqDto: CreateAccountReqDto,
    platform: string = null,
    platformId: string = null,
  ): Promise<CreateAccountResDto> {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(reqDto.password, salt);

    reqDto.password = hash;

    const roleUser = await this.roleRepo.findOneBy({
      roleName: ERole.user,
    });

    const account: AccountEntity = this.accountRepo.create({
      username: reqDto.username,
      hashedPassword: !reqDto ? null : reqDto.password, // set password to null
      email: reqDto.email,
      role: roleUser,
      status: this.statusRepo.create(),
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

      console.log(createUserReq);

      if (platform && platformId) {
        const socialMediaAccount: SocialAccountEntity =
          this.socialAccRepo.create({
            account: saveResult,
            platform: platform,
            platformId: platformId,
          });

        saveResult = await queryRunner.manager.save<SocialAccountEntity>(
          socialMediaAccount,
        );
      }

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
        statusCode: saveResult ? HttpStatus.CREATED : HttpStatus.BAD_REQUEST,
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
    return this.accountRepo.findOneBy(option);
  }

  update() {
    return `This action updates an account`;
  }

  remove(id: number) {
    return `This action removes an account`;
  }

  // It will create a new account, new social medial account too
  async socialSignup(user: SocialSignupReqDto): Promise<SocialSignupResDto> {
    // find the user who use this email to signup
    let socialAccount: SocialAccountEntity = await this.socialAccRepo.findOne({
      where: [
        {
          platform: user.platform,
          platformId: user.platformId,
        },
      ],
    });

    let statusCode = HttpStatus.UNAUTHORIZED;

    if (socialAccount) {
      statusCode = HttpStatus.OK;
    } else {
      const roleUser = await this.roleRepo.findOneBy({
        roleName: ERole.user,
      });

      let account: AccountEntity = this.accountRepo.create({
        username: user.email,
        hashedPassword: randomUUID(),
        email: user.email,
        role: roleUser,
        status: this.statusRepo.create(),
      });

      socialAccount = this.socialAccRepo.create({
        account: account,
        platform: user.platform,
        platformId: user.platformId,
      });

      (await account.socialAccounts).push(socialAccount);

      try {
        account = await this.accountRepo.save(account);

        statusCode = HttpStatus.CREATED;
      } catch (err) {
        return {
          statusCode: HttpStatus.UNAUTHORIZED,
          message: 'unauthorized',
          error: err,
        };
      }
    }

    return {
      statusCode: statusCode,
      message: 'Login success',
      data: {
        accessToken: this.authService.generateAccessJWT({
          user: {
            username: socialAccount.account.username,
            role: socialAccount.account.role.roleName,
          },
        }),
        refreshToken: this.authService.generateRefreshJWT({
          user: {
            username: socialAccount.account.username,
            role: socialAccount.account.role.roleName,
          },
        }),
      },
    };
  }
}
