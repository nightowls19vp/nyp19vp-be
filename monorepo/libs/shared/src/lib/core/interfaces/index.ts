import { ERole } from '../../authorization';

export interface IJwtPayload {
  user: IUser;
  iat?: number;
  exp?: number;
}

export enum ELoginType {
  username = 'username',
  email = 'email',
}

export interface IUser {
  username: string;
  password?: string;
  role: ERole;
  hashedPassword?: string;
}
