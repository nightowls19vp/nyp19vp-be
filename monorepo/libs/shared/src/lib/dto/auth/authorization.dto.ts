import { ERole } from '../../authorization';

export class AuthorizeReqDto {
  jwt: string;
  roles: ERole[];
}

export class AuthorizeResDto {
  result: boolean;
}
