import { Request } from 'express';

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { ACCESS_JWT_COOKIE_NAME } from '../constants/authentication';
import { AccountService } from '../services/account.service';
import { AuthService } from '../services/auth.service';
import { AccountEntity } from '../entities/account.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private reflector: Reflector,
    private readonly accountService: AccountService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const rolesCanActive = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );
    if (!rolesCanActive) {
      return true;
    }

    if (!rolesCanActive) {
      return true;
    }

    console.log('roles', rolesCanActive);

    const request: Request = context.switchToHttp().getRequest();
    const accessToken = request?.cookies?.[ACCESS_JWT_COOKIE_NAME];

    const username = this.authService.decodeToken(accessToken).username;

    const accountFound = await this.accountService.findOneBy({
      username: username,
    });
    console.log('userFound', accountFound);

    const hasRole = () => rolesCanActive.indexOf(accountFound.role.name) > -1;

    let hasPermission = false;

    if (hasRole()) {
      hasPermission = true;
    }

    return accountFound && hasPermission;
  }
}
