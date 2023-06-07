import { ApiProperty } from '@nestjs/swagger';
import { TimestampEmbeddedDto } from './timestamp.embedded.dto';

export class ProductDto {
  @ApiProperty({ required: false })
  id?: string;

  @ApiProperty({ required: false })
  name?: string;

  @ApiProperty({ required: false })
  image?: string;

  @ApiProperty({ required: false })
  barcode?: string;

  @ApiProperty({ required: false })
  price?: number;

  @ApiProperty({ required: false })
  region?: string;

  @ApiProperty({ required: false })
  brand?: string;

  @ApiProperty({ required: false })
  category?: string;

  @ApiProperty({ required: false })
  description?: string;

  // @ApiProperty({ type: () => TimestampEmbeddedDto, required: false })
  timestamp?: TimestampEmbeddedDto;
}
