import { ERole } from '../../authorization';
import { AddGrMbReqDto } from '../pkg-mgmt/gr-crud.dto';

export class AuthorizeReqDto {
  jwt: string;
  roles: ERole[];
}

export class AuthorizeResDto {
  result: boolean;
}

export class ValidateJoinGroupTokenReqDto {
  token: string;
}

export class ValidateJoinGroupTokenResDto extends AddGrMbReqDto {}
