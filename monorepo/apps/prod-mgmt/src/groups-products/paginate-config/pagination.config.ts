import { IPaginateFilterableColumns } from 'libs/shared/src/lib/common/nest-paginate-decorators/interfaces/filter.interface';
import { PaginateConfig } from 'nestjs-paginate';

import { GroupProductEntity } from '../../entities/group-product.entity';

export const filteredColumns: IPaginateFilterableColumns = {
  ['id']: true,
  ['barcode']: true,
  ['name']: true,
  ['category']: true,
  ['brand']: true,
  ['description']: true,
  ['price']: true,
  ['region']: true,
  ['timestamp.createdAt']: true,
  ['timestamp.updatedAt']: true,
};

export const groupProductsPaginateConfig: PaginateConfig<GroupProductEntity> = {
  sortableColumns: [
    'id',
    'barcode',
    'name',
    'category',
    'brand',
    'description',
    'price',
    'region',
    'timestamp.createdAt',
    'timestamp.updatedAt',
  ],
  defaultSortBy: [],
  searchableColumns: [
    'id',
    'barcode',
    'name',
    'category',
    'brand',
    'description',
    'price',
    'region',
    'timestamp.createdAt',
    'timestamp.updatedAt',
  ],
  filterableColumns: filteredColumns,
  maxLimit: 100,
  defaultLimit: 20,
  relations: [],
  loadEagerRelations: true,
  withDeleted: false,
};

export const sortableColumns: string[] =
  groupProductsPaginateConfig.sortableColumns.map((val) => `${val}`);

export const searchableColumns: string[] =
  groupProductsPaginateConfig.searchableColumns.map((val) => `${val}`);
