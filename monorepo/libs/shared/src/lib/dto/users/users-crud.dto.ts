import { BaseResDto } from '../base.dto';

export class CreateUserReqDto {
  id: string;
  name: string;
  phone: string;
  email: string;
}

export class CreateUserResDto extends BaseResDto {}
