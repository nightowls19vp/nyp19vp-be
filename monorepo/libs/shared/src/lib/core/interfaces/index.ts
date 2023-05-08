import { Paramtype } from '@nestjs/common';
import { ERole } from '../../authorization';
import { PartialType } from '@nestjs/mapped-types';

export interface IJwtPayload {
  user: IJwtPayloadUser;
  iat?: number;
  exp?: number;
}

export enum ELoginType {
  username = 'username',
  email = 'email',
}

export interface IJwtPayloadUser {
  id: string;
  username: string;
  email: string;
  role: ERole;
  userInfoId: string;
  socialAccounts: string[];
}

export class IUser implements IJwtPayloadUser {
  id: string;
  username: string;
  email: string;
  role: ERole;
  userInfoId: string;
  password?: string;
  hashedPassword?: string;
  socialAccounts: string[];
}
