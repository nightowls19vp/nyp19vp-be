import { AccountEntity } from './../entities/account.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AccountEntity)
    private accountRespo: Repository<AccountEntity>,
  ) {}
  getData(): { message: string } {
    return { message: 'Welcome to auth/Auth!' };
  }

  async validateUser(username: string, password: string): Promise<boolean> {
    const accountFound = await this.accountRespo.findOneBy({
      username: username,
    });

    return bcrypt.compare(password, accountFound.hashedPassword);
  }
}
