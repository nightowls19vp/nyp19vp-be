import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TodosCrudService } from './todos-crud.service';
import {
  AddTodosReqDto,
  BaseResDto,
  CreateTodosReqDto,
  GetTodosResDto,
  UpdateTodosReqDto,
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

  @MessagePattern(kafkaTopic.PKG_MGMT.EXTENSION.TODOS.GET)
  find(@Payload() id: Types.ObjectId): Promise<GetTodosResDto> {
    return this.todosCrudService.find(id);
  }

  @MessagePattern(kafkaTopic.PKG_MGMT.EXTENSION.TODOS.UPDATE)
  update(@Payload() updateTodosReqDto: UpdateTodosReqDto): Promise<BaseResDto> {
    return this.todosCrudService.update(updateTodosReqDto);
  }

  @MessagePattern(kafkaTopic.PKG_MGMT.EXTENSION.TODOS.ADD_TODO)
  addTodos(@Payload() addTodosReqDto: AddTodosReqDto): Promise<BaseResDto> {
    return this.todosCrudService.addTodos(addTodosReqDto);
  }

  @MessagePattern(kafkaTopic.PKG_MGMT.EXTENSION.TODOS.DEL_TODO)
  rmTodos(@Payload() addTodosReqDto: AddTodosReqDto): Promise<BaseResDto> {
    console.log(addTodosReqDto);
    return this.todosCrudService.rmTodos(addTodosReqDto);
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
