import { ApiProperty } from '@nestjs/swagger';

export class BaseResDto {
  @ApiProperty({
    description: 'Response status',
    enum: ['success', 'fail'],
  })
  status: 'success' | 'fail';

  @ApiProperty({
    description: 'Response message',
    maxLength: 255,
  })
  msg: string;
}
