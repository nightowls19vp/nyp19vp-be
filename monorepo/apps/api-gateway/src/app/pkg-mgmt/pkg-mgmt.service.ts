import {
  CollectionDto,
  CollectionResponse,
} from '@forlagshuset/nestjs-mongoose-paginate';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import {
  AddGrMbReqDto,
  RmGrMbReqDto,
  CreateGrReqDto,
  GetGrResDto,
  kafkaTopic,
  UpdateGrReqDto,
  UpdateGrPkgReqDto,
  GroupDto,
  BaseResDto,
  ValidateJoinGroupTokenResDto,
  MemberDto,
  GetGrsByUserResDto,
  UpdateAvatarReqDto,
  ActivateGrPkgReqDto,
  PkgGrInvReqDto,
  UpdateChannelReqDto,
  GetGrChannelResDto,
} from '@nyp19vp-be/shared';
import { Types } from 'mongoose';
import { catchError, firstValueFrom, timeout } from 'rxjs';
import { SocketGateway } from '../socket/socket.gateway';

@Injectable()
export class PkgMgmtService {}
