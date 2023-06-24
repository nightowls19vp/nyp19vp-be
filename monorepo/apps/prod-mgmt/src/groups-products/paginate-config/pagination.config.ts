import {
  groupProductColumns,
  groupProductsFilteredColumns,
} from 'libs/shared/src/lib/config/prod-mgmt/pagination-config/group-products/pagination.config';
import { PaginateConfig } from 'nestjs-paginate';

import { GroupProductEntity } from '../../entities/group-product.entity';

export const groupProductsPaginateConfig: PaginateConfig<GroupProductEntity> = {
  sortableColumns: groupProductColumns as never,
  defaultSortBy: [
    ['timestamp.createdAt', 'ASC'],
    ['category', 'ASC'],
    ['brand', 'ASC'],
    ['region', 'ASC'],
    ['barcode', 'ASC'],
    ['name', 'ASC'],
    ['price', 'ASC'],
  ],
  searchableColumns: groupProductColumns as never,
  filterableColumns: groupProductsFilteredColumns,
  maxLimit: 100,
  defaultLimit: 20,
  relations: [],
  loadEagerRelations: true,
  withDeleted: true,
};
