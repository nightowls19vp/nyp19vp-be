import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateUserReqDto, CreateUserResDto, kafkaTopic, UpdateUserReqDto, UpdateUserResDto } from '@nyp19vp-be/shared';
import { UsersCrudService } from './users-crud.service';

@Controller()
export class UsersCrudController {
  constructor(private readonly usersCrudService: UsersCrudService) {}

  @MessagePattern(kafkaTopic.USERS.CREATE)
  create(@Payload() createUserReqDto: CreateUserReqDto): Promise<CreateUserResDto> {
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

  @MessagePattern(kafkaTopic.USERS.UPDATE)
  update(@Payload() updateUserReqDto: UpdateUserReqDto): Promise<UpdateUserResDto> {
    return this.usersCrudService.update(updateUserReqDto);
  }

  @MessagePattern('removeUsersCrud')
  remove(@Payload() id: number) {
    return this.usersCrudService.remove(id);
  }
}
