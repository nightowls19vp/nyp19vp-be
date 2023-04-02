import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

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
