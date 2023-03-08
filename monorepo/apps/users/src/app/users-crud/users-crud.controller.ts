import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateUserReqDto, UpdateUserReqDto } from '@nyp19vp-be/shared';
import { UsersCrudService } from './users-crud.service';

@Controller()
export class UsersCrudController {
  constructor(private readonly usersCrudService: UsersCrudService) {}

  @MessagePattern('createUsersCrud')
  create(@Payload() createUserReqDto: CreateUserReqDto) {
    return this.usersCrudService.create(createUserReqDto);
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
  update(@Payload() updateUserReqDto: UpdateUserReqDto) {
    return this.usersCrudService.update(
      updateUserReqDto.id,
      updateUserReqDto
    );
  }

  @MessagePattern('removeUsersCrud')
  remove(@Payload() id: number) {
    return this.usersCrudService.remove(id);
  }
}
