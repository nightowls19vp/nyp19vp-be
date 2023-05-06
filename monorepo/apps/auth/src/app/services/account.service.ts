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
  IJwtPayload,
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

  // It will create a new account, new social medial account too if not account_id found
  // It will return the access token and refresh token if the account is existed
  async socialSignup(user: SocialSignupReqDto): Promise<SocialSignupResDto> {
    console.log('find condition', {
      platform: user.platform,
      platformId: user.platformId,
    });

    // find the social account
    let socialAccount = await this.socialAccRepo.findOneBy({
      platform: user.platform,
      platformId: user.platformId,
    });

    let account: AccountEntity = null;
    if (socialAccount) {
      account = await this.accountRepo.findOneBy({
        id: user.accountId,
      });
    }

    // if (account) {
    //   // find the social account with this platform and platformId
    //   const socialAccounts = await account.socialAccounts;
    //   const socialAccount = socialAccounts.find(
    //     (socialAccount) =>
    //       socialAccount.platform === user.platform &&
    //       socialAccount.platformId === user.platformId,
    //   );

    //   if (socialAccount) {
    //     console.log('CASE ACCOUNT && SOCIAL ACCOUNT');

    //     // if the social account is existed, return the access token and refresh token
    //     const payload: IJwtPayload = {
    //       user: {
    //         id: account.id,
    //         email: account.email,
    //         username: account.username,
    //         role: account.role.roleName,
    //         socialAccounts: [
    //           ...new Set(socialAccounts.map((sa) => sa.platform)),
    //         ],
    //       },
    //     };
    //     return {
    //       statusCode: HttpStatus.OK,
    //       message: 'login successfully',
    //       data: {
    //         accessToken: this.authService.generateAccessJWT(payload),
    //         refreshToken: this.authService.generateRefreshJWT(payload),
    //       },
    //     };
    //   }

    //   // if the social account is not existed, create a new social account
    //   else {
    //     console.log('CASE ACCOUNT && !SOCIAL ACCOUNT');

    //     const queryRunner = this.dataSource.createQueryRunner();

    //     await queryRunner.connect();
    //     await queryRunner.startTransaction();
    //     try {
    //       const socialMediaAccount: SocialAccountEntity =
    //         this.socialAccRepo.create({
    //           account: account,
    //           platform: user.platform,
    //           platformId: user.platformId,
    //         });

    //       await queryRunner.manager.save<SocialAccountEntity>(
    //         socialMediaAccount,
    //       );

    //       await queryRunner.commitTransaction();

    //       const payload: IJwtPayload = {
    //         user: {
    //           id: account.id,
    //           email: account.email,
    //           username: account.username,
    //           role: account.role.roleName,
    //           socialAccounts: [
    //             ...new Set([
    //               ...socialAccounts.map((sa) => sa.platform),
    //               user.platform,
    //             ]),
    //           ],
    //         },
    //       };
    //       return {
    //         statusCode: HttpStatus.OK,
    //         message: 'login successfully',
    //         data: {
    //           accessToken: this.authService.generateAccessJWT(payload),
    //           refreshToken: this.authService.generateRefreshJWT(payload),
    //         },
    //       };
    //     } catch (error) {
    //       await queryRunner.rollbackTransaction();
    //       return {
    //         statusCode: HttpStatus.BAD_REQUEST,
    //         message: 'login fail',
    //         error: error.message,
    //       };
    //     } finally {
    //       // you need to release a queryRunner which was manually instantiated
    //       await queryRunner.release();
    //     }
    //   }
    // }

    console.log('sa', socialAccount);
    console.log('acc', account);

    if (!socialAccount) {
      const queryRunner = this.dataSource.createQueryRunner();

      await queryRunner.connect();
      await queryRunner.startTransaction();
      AccountEntity;

      try {
        const roleUser = await this.roleRepo.findOneBy({
          roleName: ERole.user,
        });

        const password = 'password';
        const hashedPassword = await bcrypt.hash(password, 10);

        if (!account) {
          account = this.accountRepo.create({
            username: randomUUID(),
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
        } else {
          socialAccount = this.socialAccRepo.create({
            account: account,
            platform: user.platform,
            platformId: user.platformId,
          });
        }

        socialAccount = await queryRunner.manager.save<SocialAccountEntity>(
          socialAccount,
        );

        const createUserReq: CreateUserReqDto = {
          email: user.email,
          dob: null,
          name: user.name,
          phone: null,
        };

        const createUserRes: CreateUserResDto = await firstValueFrom(
          this.usersClient.send(
            kafkaTopic.USERS.CREATE,
            JSON.stringify(createUserReq),
          ),
        );

        if (createUserRes.error) {
          console.log('roll back');

          throw new Error(createUserRes.error);
        }

        await queryRunner.commitTransaction();

        console.log('socialAccount', socialAccount);
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

    if (!account || !socialAccount) {
      return {
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'SignUp failed',
      };
    }

    console.log('await account.socialAccounts', await account.socialAccounts);

    const payload: IJwtPayload = {
      user: {
        id: account.id,
        email: account.email,
        username: socialAccount.account.username,
        role: socialAccount.account.role.roleName,
        socialAccounts: (await account.socialAccounts).map((sa) => sa.platform),
      },
    };

    return {
      statusCode: HttpStatus.OK,
      message: 'SignUp successfully',
      data: {
        accessToken: this.authService.generateAccessJWT(payload),
        refreshToken: this.authService.generateRefreshJWT(payload),
      },
    };
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

    if (!account) {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        message: 'link social account fail',
      };
    }

    // find all platform of the account that linked
    const socialAccounts = await account.socialAccounts;

    // check platform is existed
    if (
      socialAccounts.find(
        (socialAccount) => socialAccount.platform === reqDto.platform,
      )
    ) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'link social account fail',
      };
    }

    const isExist = await this.socialAccRepo.exist({
      where: {
        platform: reqDto.platform,
        platformId: reqDto.platformId,
      },
    });

    console.log('account', account);

    if (!isExist) {
      // link social account to account
      const socialAccount = this.socialAccRepo.create({
        account: account,
        platform: reqDto.platform,
        platformId: reqDto.platformId,
      });

      await this.socialAccRepo.save(socialAccount);
      console.log('await account.socialAccounts', await account.socialAccounts);
      const payload: IJwtPayload = {
        user: {
          id: account.id,
          email: account.email,
          username: account.username,
          role: account?.role?.roleName,
          socialAccounts: [
            ...new Set(
              (await account.socialAccounts).map(
                (socialAccount) => socialAccount.platform,
              ),
            ),
          ],
        },
      };
      return {
        statusCode: HttpStatus.CREATED,
        message: 'link social account successfully',
        data: {
          accessToken: this.authService.generateAccessJWT(payload),
          refreshToken: this.authService.generateRefreshJWT(payload),
        },
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
