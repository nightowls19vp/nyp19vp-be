import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { ObjectId } from 'mongodb';

export class BaseResDto {
  @ApiProperty({
    description: 'Response status code',
    example: HttpStatus.OK,
  })
  statusCode: HttpStatus;

  @ApiProperty({
    description: 'Response message',
    maxLength: 255,
  })
  message: string;

  @ApiProperty({
    description: 'Error message',
  })
  error?: string;
}

export class IdDto {
  @Transform((v: TransformFnParams) => new ObjectId(v.value))
  _id: string;
}
