import * as bcrypt from 'bcrypt';
import { time } from 'console';
import { randomUUID } from 'crypto';
import { toMs } from 'libs/shared/src/lib/utils';
import { firstValueFrom, timeout } from 'rxjs';
import { DataSource, Repository } from 'typeorm';

import { Inject, Injectable } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { ClientKafka, RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateAccountReqDto,
  CreateAccountResDto,
  CreateUserReqDto,
  CreateUserResDto,
  ERole,
  GetUserInfoResDto,
  kafkaTopic,
  SocialLinkReqDto,
  SocialLinkResDto,
  SocialSignupReqDto,
  SocialSignupResDto,
} from '@nyp19vp-be/shared';

import { AccountEntity } from '../entities/account.entity';
import { RoleEntity } from '../entities/role.entity';
import { SocialAccountEntity } from '../entities/social-media-account.entity';
import { AuthService } from './auth.service';

@Injectable()
export class AccountService {
  constructor(
    private dataSource: DataSource,

    @InjectRepository(AccountEntity)
    private accountRepo: Repository<AccountEntity>,

    @InjectRepository(RoleEntity)
    private roleRepo: Repository<RoleEntity>,

    @InjectRepository(SocialAccountEntity)
    private socialAccRepo: Repository<SocialAccountEntity>,

    private readonly authService: AuthService,

    @Inject('USERS_SERVICE') private readonly usersClient: ClientKafka,
  ) {}
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
    // find the account with this email
    let account: AccountEntity = await this.accountRepo.findOneBy({
      email: user.email,
    });

    if (account) {
      // find the social account with this platform and platformId
      const socialAccounts = (await account.socialAccounts).filter(
        (socialAccount) =>
          socialAccount.platform === user.platform &&
          socialAccount.platformId === user.platformId,
      );

      // if the social account is existed, return the access token and refresh token
      if (socialAccounts.length > 0) {
        return {
          statusCode: HttpStatus.OK,
          message: 'login successfully',
          data: {
            accessToken: this.authService.generateAccessJWT({
              user: {
                username: account.username,
                role: account.role.roleName,
              },
            }),
            refreshToken: this.authService.generateRefreshJWT({
              user: {
                username: account.username,
                role: account.role.roleName,
              },
            }),
          },
        };
      }
    }

    // if the social account is not existed, create a new account and a new social account
    let socialAccount: SocialAccountEntity = await this.socialAccRepo.findOne({
      where: [
        {
          platform: user.platform,
          platformId: user.platformId,
        },
      ],
    });

    let statusCode = HttpStatus.UNAUTHORIZED;

    if (socialAccount && socialAccount.account) {
      statusCode = HttpStatus.OK;
    } else {
      const queryRunner = this.dataSource.createQueryRunner();

      await queryRunner.connect();
      await queryRunner.startTransaction();
      AccountEntity;

      try {
        const roleUser = await this.roleRepo.findOneBy({
          roleName: ERole.user,
        });

        const password = randomUUID();
        const hashedPassword = await bcrypt.hash(password, 10);

        account = this.accountRepo.create({
          username: user.email,
          hashedPassword: hashedPassword,
          email: user.email,
          role: roleUser,
        });

        account = await queryRunner.manager.save<AccountEntity>(account);

        socialAccount = this.socialAccRepo.create({
          account: account,
          platform: user.platform,
          platformId: user.platformId,
        });

        socialAccount = await queryRunner.manager.save<SocialAccountEntity>(
          socialAccount,
        );

        const createUserReq: CreateUserReqDto = {
          email: user.email ?? null,
          dob: null,
          name: user.name ?? null,
          phone: null,
        };

        await queryRunner.commitTransaction();

        console.log('socialAccount', socialAccount);
        statusCode = HttpStatus.CREATED;

        return {
          statusCode: statusCode,
          message: 'SignUp successfully',
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
      } catch (error) {
        await queryRunner.rollbackTransaction();
        return {
          statusCode: HttpStatus.UNAUTHORIZED,
          message: 'create account fail',
          error: error.message,
        };
      } finally {
        // you need to release a queryRunner which was manually instantiated
        await queryRunner.release();
      }
    }
  }

  /** Create user info
   * Return user info if success else throw error
   * @param reqDto
   * @returns
   */
  async createUserInfo(reqDto: CreateUserReqDto): Promise<CreateUserResDto> {
    const createUserInfoRes: CreateUserResDto = await firstValueFrom(
      this.usersClient
        .send(
          kafkaTopic.USERS.CREATE,
          JSON.stringify({
            email: reqDto.email,
            dob: reqDto.dob,
            name: reqDto.name,
            phone: reqDto.dob,
          }),
        )
        .pipe(timeout(toMs('5s'))),
    );

    console.log(createUserInfoRes);

    if (
      !createUserInfoRes.statusCode.toString().startsWith('2') ||
      createUserInfoRes.error
    ) {
      throw new Error(createUserInfoRes.error || 'create user fail');
    }

    return createUserInfoRes;
  }

  async socialLink(reqDto: SocialLinkReqDto): Promise<SocialLinkResDto> {
    // check if the account is existed
    const account = await this.accountRepo.findOneBy({
      id: reqDto.accountId,
    });

    let socialAccount = await this.socialAccRepo.findOneBy({
      platform: reqDto.platform,
      platformId: reqDto.platformId,
    });

    if (account && !socialAccount) {
      // link social account to account
      socialAccount = this.socialAccRepo.create({
        account: account,
        platform: reqDto.platform,
        platformId: reqDto.platformId,
      });

      await this.socialAccRepo.save(socialAccount);

      return {
        statusCode: HttpStatus.CREATED,
        message: 'link social account successfully',
      };
    } else {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'link social account fail',
      };
    }
  }

  // async socialUnlink(reqDto: SocialUnlinkReqDto): Promise<SocialUnlinkResDto> {
  //   throw new RpcException('not implemented');
  // }

  async getUserInfoByEmail(email: string): Promise<GetUserInfoResDto> {
    try {
      const getUserInfoRes: GetUserInfoResDto = await firstValueFrom(
        this.usersClient
          .send(kafkaTopic.USERS.GET_INFO_BY_EMAIL, email)
          .pipe(timeout(toMs('5s'))),
      );

      return getUserInfoRes;
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'get user info fail',
        error: error.message,
        user: null,
      };
    }
  }
}
