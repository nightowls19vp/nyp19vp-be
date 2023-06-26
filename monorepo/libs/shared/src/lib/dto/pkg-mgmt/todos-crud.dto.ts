import { ApiProperty, IntersectionType, OmitType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';
import { BaseResDto, IdDto } from '../base.dto';

class TodoDto {
  @ApiProperty({ type: String, nullable: true, required: true })
  todo: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  description?: string;

  @ApiProperty({ type: Boolean, required: false, default: false })
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
export class GetTodosResDto extends BaseResDto {
  todos: TodosDto[];
}
export class UpdateTodosReqDto extends IntersectionType(
  IdDto,
  OmitType(TodosDto, ['createdBy']),
) {}

export class AddTodosReqDto extends IntersectionType(
  IdDto,
  OmitType(TodosDto, ['createdBy', 'summary']),
) {}
