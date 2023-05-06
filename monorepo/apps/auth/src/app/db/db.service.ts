import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ERole } from '@nyp19vp-be/shared';

import { AccountEntity } from '../entities/account.entity';
import { RoleEntity } from '../entities/role.entity';
import { SocialAccountEntity } from '../entities/social-media-account.entity';
import { AccountService } from '../services/account.service';

@Injectable()
export class DbService {
  constructor(
    @InjectRepository(AccountEntity)
    private accountRepo: Repository<AccountEntity>,

    @InjectRepository(RoleEntity)
    private roleRepo: Repository<RoleEntity>,

    @InjectRepository(SocialAccountEntity)
    private socialAccRepo: Repository<SocialAccountEntity>,

    private readonly accountService: AccountService,
  ) {
    this.init();
  }

  async initAdmin() {
    const roleAdmin = await this.roleRepo.findOneBy({
      roleName: ERole.admin,
    });

    const username = process.env.ADMIN_USERNAME || 'admin@email.com';

    const passsword = process.env.ADMIN_PASSWORD || 'admin';

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(passsword, salt);

    const email = process.env.ADMIN_EMAIL || 'admin@email.com';

    // save admin
    const adminAccount = this.accountRepo.create({
      id: 'admin',
      username: username,
      hashedPassword: hashedPassword,
      email: email,
      role: roleAdmin,
    });

    try {
      await this.accountRepo.save(adminAccount);
      await this.accountService.createUserInfo({
        email: email,
        name: 'admin',
        dob: null,
        phone: null,
      });
    } catch (error) {
      //
    }
  }

  async initRoles() {
    const roleAdmin = this.roleRepo.create({
      roleId: 1,
      roleName: ERole.admin,
    });

    const roleUser = this.roleRepo.create({
      roleId: 2,
      roleName: ERole.user,
    });

    try {
      await this.roleRepo.save([roleAdmin, roleUser]);
    } catch (error) {
      //
    }
  }

  //int n user
  async initUser(n: number) {
    for (let i = 0; i < n; i++) {
      const hashedPassword = await bcrypt.hash('password', 10);

      const roleUser = await this.roleRepo.findOneBy({
        roleName: ERole.user,
      });

      const user1 = this.accountRepo.create({
        id: 'user' + i,
        username: 'user' + i + '@email.com',
        hashedPassword: hashedPassword,
        email: 'user' + i + '@gmail.com',
        role: roleUser,
      });

      try {
        //save user
        await this.accountRepo.save(user1);

        // save user info
        const res = await this.accountService.createUserInfo({
          email: 'user' + i + '@gmail.com',
          name: 'user' + i,
          dob: null,
          phone: null,
        });

        console.error('\n\nres', res);
      } catch (error) {
        console.log(error);
      }
    }
  }
  // init all data
  async init() {
    try {
      await this.initRoles();
      await this.initAdmin();
      await this.initUser(10);
    } catch (error) {
      console.log(error);
    }
  }
}
