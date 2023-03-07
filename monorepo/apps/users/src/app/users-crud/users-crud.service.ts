import { Injectable } from '@nestjs/common';
import { CreateUsersCrudDto } from './dto/create-users-crud.dto';
import { UpdateUsersCrudDto } from './dto/update-users-crud.dto';

@Injectable()
export class UsersCrudService {
  create(createUsersCrudDto: CreateUsersCrudDto) {
    return 'This action adds a new usersCrud';
  }

  findAll() {
    return `This action returns all usersCrud`;
  }

  findOne(id: number) {
    return `This action returns a #${id} usersCrud`;
  }

  update(id: number, updateUsersCrudDto: UpdateUsersCrudDto) {
    return `This action updates a #${id} usersCrud`;
  }

  remove(id: number) {
    return `This action removes a #${id} usersCrud`;
  }
}
