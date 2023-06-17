import { Paginated, PaginateQuery } from 'nestjs-paginate';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { BaseResDto } from '../../base.dto';
import { ItemDto } from '../dto/item.dto';

/** CREATE ITEM */

export class CreateItemReqDto extends ItemDto {
  @ApiProperty({ required: true })
  groupProductId: string;

  @ApiProperty({ required: true })
  storageLocationId: string;

  @ApiProperty({ required: true })
  purchaseLocationId: string;
}

export class CreateItemResDto extends BaseResDto {
  @ApiProperty({
    type: ItemDto,
  })
  data?: ItemDto;
}

/** GET ITEM BY ID */

export class GetItemByIdReqDto {
  @ApiProperty()
  id: string;
}

export class GetItemByIdResDto extends BaseResDto {
  @ApiProperty({
    type: ItemDto,
  })
  data?: ItemDto;
}

/** GET ITEMS **PAGINATED** */

export class GetItemsPaginatedReqDto implements PaginateQuery {
  page?: number;
  limit?: number;
  sortBy?: [string, string][];
  searchBy?: string[];
  search?: string;
  filter?: { [column: string]: string | string[] };
  select?: string[];
  path: string;

  @ApiProperty()
  groupId: string;

  @ApiPropertyOptional()
  groupProductId?: string;
}

export class GetItemsPaginatedResDto extends Paginated<ItemDto> {
  @ApiProperty()
  statusCode: number;

  @ApiProperty()
  message: string;
}

/** DELETE ITEM */

export class DeleteItemReqDto {
  @ApiProperty()
  id: string;
}

export class DeleteItemResDto extends BaseResDto {
  @ApiProperty({
    type: ItemDto,
  })
  data?: ItemDto;
}

/** UPDATE ITEM */

/**
 * The `UpdateItemReqDto.id` will be filled by the `@Param('id')` decorator in the controller.
 */
export class UpdateItemReqDto extends ItemDto {}

export class UpdateItemResDto extends BaseResDto {
  @ApiProperty({
    type: ItemDto,
  })
  data?: ItemDto;
}

/** RESTORE ITEM */

/**
 * The `RestoreItemReqDto.id` will be filled by the `@Param('id')` decorator in the controller.
 */
export class RestoreItemReqDto {
  @ApiProperty()
  id: string;
}

export class RestoreItemResDto extends BaseResDto {
  @ApiProperty({
    type: ItemDto,
  })
  data?: ItemDto;
}
