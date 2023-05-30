import { ApiProperty } from '@nestjs/swagger';

export class TimestampEmbeddedEntity {
  @ApiProperty({
    description: 'Created at',
    type: Date,
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Updated at',
    type: Date,
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'Deleted at',
    type: Date,
  })
  deletedAt: Date;
}
