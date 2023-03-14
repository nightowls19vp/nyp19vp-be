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
export class LocalAuthGuard extends AuthGuard(LOCAL_STRATEGY_NAME) {}
