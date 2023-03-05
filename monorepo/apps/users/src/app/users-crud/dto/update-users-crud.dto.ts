import { PartialType } from '@nestjs/mapped-types';
import { CreateUsersCrudDto } from './create-users-crud.dto';

export class UpdateUsersCrudDto extends PartialType(CreateUsersCrudDto) {
  id: number;
}
