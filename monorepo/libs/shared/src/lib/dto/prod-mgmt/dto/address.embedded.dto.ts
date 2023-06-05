import { ApiProperty } from '@nestjs/swagger';

export class AddressEmbeddedDto {
  @ApiProperty({ required: false })
  addressLine1?: string;

  @ApiProperty({ required: false })
  addressLine2?: string;

  @ApiProperty({ required: false })
  provinceCode?: string;

  @ApiProperty({ required: false })
  provinceName?: string;

  @ApiProperty({ required: false })
  districtCode?: string;

  @ApiProperty({ required: false })
  districtName?: string;

  @ApiProperty({ required: false })
  wardCode?: string;

  @ApiProperty({ required: false })
  wardName?: string;
}
