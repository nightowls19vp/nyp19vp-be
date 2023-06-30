import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TodosCrudService } from './todos-crud.service';
import {
  AddTodosReqDto,
  BaseResDto,
  CreateTodosReqDto,
  GetTodosResDto,
  RmTodosReqDto,
  UpdateTodoReqDto,
  UpdateTodosReqDto,
  UpdateTodosStateReqDto,
  kafkaTopic,
} from '@nyp19vp-be/shared';
import { Types } from 'mongoose';

@Controller()
export class TodosCrudController {
  constructor(private readonly todosCrudService: TodosCrudService) {}

  @MessagePattern(kafkaTopic.PKG_MGMT.EXTENSION.TODOS.CREATE)
  create(@Payload() createTodosReqDto: CreateTodosReqDto): Promise<BaseResDto> {
    return this.todosCrudService.create(createTodosReqDto);
  }

  @MessagePattern(kafkaTopic.PKG_MGMT.EXTENSION.TODOS.GET_BY_ID)
  findById(@Payload() id: Types.ObjectId): Promise<GetTodosResDto> {
    return this.todosCrudService.findById(id);
  }

  @MessagePattern(kafkaTopic.PKG_MGMT.EXTENSION.TODOS.UPDATE)
  update(@Payload() updateTodosReqDto: UpdateTodosReqDto): Promise<BaseResDto> {
    return this.todosCrudService.update(updateTodosReqDto);
  }

  @MessagePattern(kafkaTopic.PKG_MGMT.EXTENSION.TODOS.UPDATE_STATE)
  updateState(
    @Payload() updateTodosStateReqDto: UpdateTodosStateReqDto,
  ): Promise<BaseResDto> {
    return this.todosCrudService.updateState(updateTodosStateReqDto);
  }

  @MessagePattern(kafkaTopic.PKG_MGMT.EXTENSION.TODOS.UPDATE_TODO)
  updateTodo(
    @Payload() updateTodoReqDto: UpdateTodoReqDto,
  ): Promise<BaseResDto> {
    return this.todosCrudService.updateTodo(updateTodoReqDto);
  }

  @MessagePattern(kafkaTopic.PKG_MGMT.EXTENSION.TODOS.DEL_TODO)
  rmTodos(@Payload() rmTodosReqDto: RmTodosReqDto): Promise<BaseResDto> {
    return this.todosCrudService.rmTodos(rmTodosReqDto);
  }

  @MessagePattern(kafkaTopic.PKG_MGMT.EXTENSION.TODOS.ADD_TODO)
  addTodos(@Payload() addTodosReqDto: AddTodosReqDto): Promise<BaseResDto> {
    return this.todosCrudService.addTodos(addTodosReqDto);
  }

  @MessagePattern(kafkaTopic.PKG_MGMT.EXTENSION.TODOS.DELETE)
  remove(@Payload() id: Types.ObjectId): Promise<BaseResDto> {
    return this.todosCrudService.remove(id);
  }

  @MessagePattern(kafkaTopic.PKG_MGMT.EXTENSION.TODOS.RESTORE)
  restore(@Payload() id: Types.ObjectId): Promise<BaseResDto> {
    return this.todosCrudService.restore(id);
  }
}
