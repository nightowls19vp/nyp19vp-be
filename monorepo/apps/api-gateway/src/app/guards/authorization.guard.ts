import { getAccessJwt } from './../auth/utils/auth.util';
import { AuthService } from './../auth/auth.service';
import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Request, Response } from 'express';
import { Reflector } from '@nestjs/core';
import { resolve } from 'path';
import { ERole } from '@nyp19vp-be/shared';

export class AuthorizationGuards implements CanActivate {
  req: Request;
  res: Response;

  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
  ) {}

  canActivate(context: ExecutionContext): Promise<boolean> {
    return new Promise((resolve) => {
      const roles = this.reflector.get<ERole[]>('roles', context.getHandler());
      if (!roles) {
        resolve(true);
      }
      this.req = context.switchToHttp().getRequest();

      const jwt = getAccessJwt(this.req);

      resolve(this.authService.authorize(jwt, roles));
    });
  }
}
