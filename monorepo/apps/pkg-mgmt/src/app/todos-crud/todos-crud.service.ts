import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  AddTodosReqDto,
  BaseResDto,
  CreateTodosReqDto,
  GetTodosResDto,
  UpdateTodosReqDto,
} from '@nyp19vp-be/shared';
import { GrCrudService } from '../gr-crud/gr-crud.service';
import { Group, GroupDocument } from '../../schemas/group.schema';
import { SoftDeleteModel } from 'mongoose-delete';
import { Todos, TodosDocument } from '../../schemas/todos.schema';
import { Types } from 'mongoose';

@Injectable()
export class TodosCrudService {
  constructor(
    private readonly grCrudService: GrCrudService,
    @InjectModel(Group.name) private grModel: SoftDeleteModel<GroupDocument>,
    @InjectModel(Todos.name) private todosModel: SoftDeleteModel<TodosDocument>,
  ) {}
  async create(createTodosReqDto: CreateTodosReqDto): Promise<BaseResDto> {
    const { _id, createdBy } = createTodosReqDto;
    const isAuthor = await this.grCrudService.isGrU(_id, [createdBy]);
    if (!isAuthor) {
      return Promise.resolve({
        statusCode: HttpStatus.UNAUTHORIZED,
        error: 'UNAUTHORIZED',
        message: `MUST be group's member to create bill`,
      });
    } else {
      const newTodos = new this.todosModel({
        summary: createTodosReqDto.summary,
        todos: createTodosReqDto.todos,
        createdBy: createdBy,
      });
      return await newTodos.save().then(async (saveTodos) => {
        return await this.grModel
          .findByIdAndUpdate({ _id: _id }, { $push: { todos: saveTodos } })
          .then((res) => {
            if (res) {
              return Promise.resolve({
                statusCode: HttpStatus.CREATED,
                message: `Created todos of group ${_id} successfully`,
                data: saveTodos,
              });
            } else {
              return Promise.resolve({
                statusCode: HttpStatus.NOT_FOUND,
                error: 'NOT FOUND',
                message: `Group #${_id} not found`,
                data: undefined,
              });
            }
          })
          .catch((error) => {
            return Promise.resolve({
              statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
              message: error.message,
              error: 'INTERNAL SERVER ERROR',
            });
          });
      });
    }
  }
  async find(_id: Types.ObjectId): Promise<GetTodosResDto> {
    console.log(`Get todos of group #${_id}`);
    return await this.grModel
      .findOne({ _id: _id }, { todos: 1 })
      .populate({ path: 'todos', model: 'Todos' })
      .then((res) => {
        if (res) {
          return Promise.resolve({
            statusCode: HttpStatus.OK,
            message: `Got todos of group ${_id} successfully`,
            todos: res.todos,
          });
        } else {
          return Promise.resolve({
            statusCode: HttpStatus.NOT_FOUND,
            message: `Group #${_id} not found`,
            todos: null,
          });
        }
      })
      .catch((error) => {
        return Promise.resolve({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message,
          error: 'INTERNAL SERVER ERROR',
          todos: null,
        });
      });
  }
  async update(updateTodosReqDto: UpdateTodosReqDto): Promise<BaseResDto> {
    const { _id } = updateTodosReqDto;
    console.log(`Updaate todos #${_id}`);
    // return await this.todosModel
    //   .restore({ _id: id })
    //   .then((res) => {
    //     return Promise.resolve({
    //       statusCode: HttpStatus.OK,
    //       message: `Restore todos ${id} successfully`,
    //       data: res,
    //     });
    //   })
    //   .catch((error) => {
    return Promise.resolve({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'error.message',
      error: 'INTERNAL SERVER ERROR',
    });
    // });
  }
  async addTodos(addTodosReqDto: AddTodosReqDto): Promise<BaseResDto> {
    const { _id, todos } = addTodosReqDto;
    console.log(`Add todos to list #${_id}`, todos);
    return await this.todosModel
      .findByIdAndUpdate({ _id: _id }, { $push: { todos: { $each: todos } } })
      .then(async (res) => {
        if (res) {
          const res = await this.todosModel.findById({ _id: _id });
          return Promise.resolve({
            statusCode: HttpStatus.OK,
            message: `Added todos to list ${_id} successfully`,
            data: res.todos,
          });
        } else {
          return Promise.resolve({
            statusCode: HttpStatus.NOT_FOUND,
            message: `Todos list #${_id} not found`,
            data: null,
          });
        }
      })
      .catch((error) => {
        return Promise.resolve({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message,
          error: 'INTERNAL SERVER ERROR',
        });
      });
  }
  async rmTodos(addTodosReqDto: AddTodosReqDto): Promise<BaseResDto> {
    const { _id, todos } = addTodosReqDto;
    console.log(`Remove todos to list #${_id}`, todos);
    try {
      const checklist = await this.todosModel.findById({ _id: _id });
      console.log(checklist);
      if (!checklist) {
        return Promise.resolve({
          statusCode: HttpStatus.NOT_FOUND,
          message: `Todos list #${_id} not found`,
          error: 'NOT FOUND',
        });
      } else {
        checklist.todos = checklist.todos.filter((elem) => {
          if (
            todos.some(
              (item) =>
                item.todo == elem.todo &&
                item.description == elem.description &&
                item.isCompleted == elem.isCompleted,
            )
          ) {
            return false;
          } else {
            return true;
          }
        });

        await checklist.save();

        return {
          statusCode: HttpStatus.OK,
          message: `Removed todos to list #${_id} successfully`,
          data: checklist,
        };
      }
    } catch (error) {
      return Promise.resolve({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
        error: 'INTERNAL SERVER ERROR',
      });
    }
  }
  async remove(id: Types.ObjectId): Promise<BaseResDto> {
    console.log(`Remove todos #${id}`);
    return await this.todosModel
      .deleteById(id)
      .then((res) => {
        return Promise.resolve({
          statusCode: HttpStatus.OK,
          message: `Remove todos ${id} successfully`,
          data: res,
        });
      })
      .catch((error) => {
        return Promise.resolve({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message,
          error: 'INTERNAL SERVER ERROR',
        });
      });
  }
  async restore(id: Types.ObjectId): Promise<BaseResDto> {
    console.log(`Restore todos #${id}`);
    return await this.todosModel
      .restore({ _id: id })
      .then((res) => {
        return Promise.resolve({
          statusCode: HttpStatus.OK,
          message: `Restore todos ${id} successfully`,
          data: res,
        });
      })
      .catch((error) => {
        return Promise.resolve({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message,
          error: 'INTERNAL SERVER ERROR',
        });
      });
  }
}
