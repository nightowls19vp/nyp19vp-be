export interface IJwtPayload {
  username: string;
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
}
