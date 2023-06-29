import {
  ApiProperty,
  IntersectionType,
  OmitType,
  PickType,
} from '@nestjs/swagger';
import { Transform, TransformFnParams, Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';
import { BaseResDto, IdDto } from '../base.dto';
import { UserInfo } from '../users/users-crud.dto';
import { ObjectId } from 'mongodb';

class TodoDto {
  @ApiProperty({
    type: String,
    nullable: true,
    required: true,
    example: 'Milk Shake',
  })
  todo: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  description?: string;

  @ApiProperty({
    type: Boolean,
    required: false,
    default: false,
    example: true,
  })
  isCompleted: boolean;
}

export class TodosDto {
  @ApiProperty({
    type: String,
    nullable: true,
    required: true,
    example: 'Đi Chợ',
  })
  summary: string;

  @ApiProperty({
    example: [
      {
        todo: 'Nước tương tam thái tử',
        description: 'Mua 2 chai',
        isCompleted: false,
      },
      {
        todo: 'Tương ớt Cholimex',
        description: null,
        isCompleted: false,
      },
    ],
  })
  @Type(() => TodoDto)
  @ValidateNested({ each: true })
  todos: TodoDto[];

  createdBy: string;

  updatedBy: string;
}
export class CreateTodosReqDto extends IntersectionType(
  IdDto,
  OmitType(TodosDto, ['updatedBy']),
) {}

export class GetGrDto_Todos extends IntersectionType(
  IdDto,
  OmitType(TodosDto, ['createdBy', 'updatedBy']),
) {
  createdBy: UserInfo;
  updatedBy: UserInfo;
}

export class GetTodosResDto extends BaseResDto {
  todos: GetGrDto_Todos;
}
export class UpdateTodosReqDto extends IntersectionType(
  IdDto,
  PickType(TodosDto, ['summary', 'updatedBy']),
) {}

export class UpdateTodoReqDto extends IntersectionType(
  IdDto,
  TodoDto,
  PickType(TodosDto, ['updatedBy']),
) {
  @Transform((v: TransformFnParams) => new ObjectId(v.value))
  todo_id: string;
}

export class AddTodosReqDto extends IntersectionType(
  IdDto,
  OmitType(TodosDto, ['createdBy', 'summary']),
) {}

class TodoIdDto {
  @ApiProperty({ example: '649d444e5cd6f0886494a6ab' })
  @Transform((v: TransformFnParams) => new ObjectId(v.value))
  _id: string;
}

export class RmTodosReqDto extends IntersectionType(
  IdDto,
  PickType(TodosDto, ['updatedBy']),
) {
  @ApiProperty({ example: [{ _id: '649d444e5cd6f0886494a6ab' }] })
  @ValidateNested({ each: true })
  @Type(() => TodoIdDto)
  todos: TodoIdDto[];
}
