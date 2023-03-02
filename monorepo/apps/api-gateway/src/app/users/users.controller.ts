import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserReqDto } from '@nyp19vp-be/shared';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  createUser(@Body() createUserReqDto: CreateUserReqDto) {
    return createUserReqDto;
  }
}
