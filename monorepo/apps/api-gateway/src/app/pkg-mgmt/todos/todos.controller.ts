import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Put,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import {
  AddTodosReqDto,
  BaseResDto,
  CreateTodosReqDto,
  GetTodosResDto,
  ParseObjectIdPipe,
  UpdateTodosReqDto,
} from '@nyp19vp-be/shared';
import { AccessJwtAuthGuard } from '../../auth/guards/jwt.guard';
import { SWAGGER_BEARER_AUTH_ACCESS_TOKEN_NAME } from '../../constants/authentication';
import {
  ApiBearerAuth,
  ApiTags,
  ApiParam,
  ApiOperation,
} from '@nestjs/swagger';
import { ATUser } from '../../decorators/at-user.decorator';
import { Types } from 'mongoose';

@ApiTags('Package Management/Todos')
@Controller('pkg-mgmt/todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @ApiBearerAuth(SWAGGER_BEARER_AUTH_ACCESS_TOKEN_NAME)
  @UseGuards(AccessJwtAuthGuard)
  @Post(':group_id')
  create(
    @ATUser() user: unknown,
    @Param('group_id') id: string,
    @Body() createTodosReqDto: CreateTodosReqDto,
  ): Promise<BaseResDto> {
    console.log(`Create billing of group #${id}`, createTodosReqDto);
    createTodosReqDto._id = id;
    createTodosReqDto.createdBy = user?.['userInfo']?.['_id'];
    return this.todosService.create(createTodosReqDto);
  }

  @ApiBearerAuth(SWAGGER_BEARER_AUTH_ACCESS_TOKEN_NAME)
  @UseGuards(AccessJwtAuthGuard)
  @ApiParam({ name: 'group_id', type: String })
  @Get(':group_id')
  find(
    @Param('group_id', new ParseObjectIdPipe()) id: Types.ObjectId,
  ): Promise<GetTodosResDto> {
    console.log(`Get todos of group #${id}`);
    return this.todosService.find(id);
  }

  @ApiBearerAuth(SWAGGER_BEARER_AUTH_ACCESS_TOKEN_NAME)
  @UseGuards(AccessJwtAuthGuard)
  @Put(':todos_id')
  update(
    @Param('todos_id') id: string,
    @Body() updateTodosReqDto: UpdateTodosReqDto,
  ): Promise<BaseResDto> {
    console.log(`Update todos #${id}`, updateTodosReqDto);
    updateTodosReqDto._id = id;
    return this.todosService.update(updateTodosReqDto);
  }

  @ApiBearerAuth(SWAGGER_BEARER_AUTH_ACCESS_TOKEN_NAME)
  @UseGuards(AccessJwtAuthGuard)
  @ApiOperation({ summary: 'Remove todos from checklist' })
  @Delete(':todos_id')
  rmTodos(
    @Param('todos_id') id: string,
    @Body() addTodosReqDto: AddTodosReqDto,
  ): Promise<BaseResDto> {
    console.log(`Remove todos #${id}`, addTodosReqDto);
    addTodosReqDto._id = id;
    return this.todosService.rmTodos(addTodosReqDto);
  }

  @ApiBearerAuth(SWAGGER_BEARER_AUTH_ACCESS_TOKEN_NAME)
  @UseGuards(AccessJwtAuthGuard)
  @ApiOperation({ summary: 'Add todos to checklist' })
  @Put(':todos_id/todo')
  addTodos(
    @Param('todos_id') id: string,
    @Body() addTodosReqDto: AddTodosReqDto,
  ): Promise<BaseResDto> {
    console.log(`Add todos #${id}`, addTodosReqDto);
    addTodosReqDto._id = id;
    return this.todosService.addTodos(addTodosReqDto);
  }

  @ApiBearerAuth(SWAGGER_BEARER_AUTH_ACCESS_TOKEN_NAME)
  @UseGuards(AccessJwtAuthGuard)
  @Delete(':todos_id')
  remove(
    @Param('id', new ParseObjectIdPipe()) id: Types.ObjectId,
  ): Promise<BaseResDto> {
    console.log(`Delete todos #${id}`);
    return this.todosService.remove(id);
  }

  @ApiBearerAuth(SWAGGER_BEARER_AUTH_ACCESS_TOKEN_NAME)
  @UseGuards(AccessJwtAuthGuard)
  @Patch(':todos_id')
  restore(
    @Param('id', new ParseObjectIdPipe()) id: Types.ObjectId,
  ): Promise<BaseResDto> {
    console.log(`Restore todos #${id}`);
    return this.todosService.restore(id);
  }
}
