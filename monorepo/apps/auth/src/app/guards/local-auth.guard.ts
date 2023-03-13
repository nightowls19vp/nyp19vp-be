import { Request, Response } from 'express';

import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LOCAL_STRATEGY_NAME } from '../constants/authentication';
import { AuthService } from '../services/auth.service';
import { RpcException } from '@nestjs/microservices';
import { BaseResDto } from 'libs/shared/src/lib/dto/base.dto';
import { LoginResDto } from '@nyp19vp-be/shared';

@Injectable()
export class LocalAuthGuard extends AuthGuard(LOCAL_STRATEGY_NAME) {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }
  handleRequest(err, user, info) {
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      const errRes: LoginResDto = {
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'cannot login',
        error: info.message,
      };
      throw new RpcException(err);
    }
    return user;
  }
}
