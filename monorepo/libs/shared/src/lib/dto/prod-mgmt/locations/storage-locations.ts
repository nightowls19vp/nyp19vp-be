import { PartialType, PickType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';

import { BaseResDto } from '../../base.dto';
import { ProdMgmtGroupDto } from '../dto/group.dto';
import { StorageLocationDto } from '../dto/storage-location.dto';
import { PaginateQuery, Paginated } from 'nestjs-paginate';

export class CreateStorageLocationReqDto extends PickType(
  PartialType(StorageLocationDto),
  ['name', 'addedBy', 'image', 'description'],
) {
  @ApiProperty()
  groupId?: string;

  @ApiProperty({
    readOnly: true,
  })
  group?: ProdMgmtGroupDto;
}

export class CreateStorageLocationResDto extends BaseResDto {
  @ApiProperty({ type: StorageLocationDto })
  data?: StorageLocationDto;
}

export class GetStorageLocationByIdReqDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  groupId: string;
}

export class GetStorageLocationByIdResDto extends BaseResDto {
  @ApiProperty({ type: StorageLocationDto })
  data?: StorageLocationDto;
}

export class GetStorageLocationsPaginatedReqDto implements PaginateQuery {
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
}

export class GetStorageLocationsPaginatedResDto extends Paginated<StorageLocationDto> {
  @ApiProperty()
  statusCode: number;

  @ApiProperty()
  message: string;
}

export class DeleteStorageLocationReqDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  groupId: string;
}

export class DeleteStorageLocationResDto extends BaseResDto {
  @ApiProperty({ type: StorageLocationDto })
  data?: StorageLocationDto;
}

export class RestoreStorageLocationReqDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  groupId: string;
}

export class RestoreStorageLocationResDto extends BaseResDto {
  @ApiProperty({ type: StorageLocationDto })
  data?: StorageLocationDto;
}

export class UpdateStorageLocationReqDto extends StorageLocationDto {
  @ApiProperty({
    readOnly: true,
  })
  groupId: string;

  @ApiProperty({
    readOnly: true,
  })
  id: string;
}

export class UpdateStorageLocationResDto extends BaseResDto {
  @ApiProperty({
    type: StorageLocationDto,
    description: 'Updated storage location (new)',
  })
  data?: StorageLocationDto;
}
