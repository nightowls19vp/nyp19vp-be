import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UsersCrudService } from './users-crud.service';
import { CreateUsersCrudDto } from './dto/create-users-crud.dto';
import { UpdateUsersCrudDto } from './dto/update-users-crud.dto';

@Controller()
export class UsersCrudController {
  constructor(private readonly usersCrudService: UsersCrudService) {}

  @MessagePattern('createUsersCrud')
  create(@Payload() createUsersCrudDto: CreateUsersCrudDto) {
    return this.usersCrudService.create(createUsersCrudDto);
  }

  @MessagePattern('findAllUsersCrud')
  findAll() {
    return this.usersCrudService.findAll();
  }

  @MessagePattern('findOneUsersCrud')
  findOne(@Payload() id: number) {
    return this.usersCrudService.findOne(id);
  }

  @MessagePattern('updateUsersCrud')
  update(@Payload() updateUsersCrudDto: UpdateUsersCrudDto) {
    return this.usersCrudService.update(
      updateUsersCrudDto.id,
      updateUsersCrudDto
    );
  }

  @MessagePattern('removeUsersCrud')
  remove(@Payload() id: number) {
    return this.usersCrudService.remove(id);
  }
}
