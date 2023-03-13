import * as dotenv from 'dotenv';
import { Request, Response } from 'express';
import { ENV_FILE } from 'libs/shared/src/lib/core/constants';

import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import {
  ACCESS_JWT_STRATEGY_NAME,
  REFRESH_JWT_COOKIE_NAME,
  REFRESH_JWT_STRATEGY_NAME,
} from '../constants/authentication';
import { IJwtPayload } from '../interfaces';
import { AuthService } from '../services/auth.service';
import { BaseResDto } from 'libs/shared/src/lib/dto/base.dto';
import { RpcException } from '@nestjs/microservices';

dotenv.config({
  path: process.env.ENV_FILE ? process.env.ENV_FILE : ENV_FILE.DEV,
});

@Injectable()
export class AccessJwtAuthGuard extends AuthGuard(ACCESS_JWT_STRATEGY_NAME) {
  handleRequest(err, user, info) {
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      throw new RpcException({
        err: err,
      });
    }
    return user;
  }
}

@Injectable()
export class RefreshJwtAuthGuard extends AuthGuard(REFRESH_JWT_STRATEGY_NAME) {
  handleRequest(err, user, info) {
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      throw new RpcException({
        err: err,
      });
    }
    return user;
  }
}
