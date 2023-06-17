import { IPaginateFilterableColumns } from 'libs/shared/src/lib/common/nest-paginate-decorators/interfaces/filter.interface';

export const groupProductsFilteredColumns: IPaginateFilterableColumns = {
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
  ['timestamp.deletedAt']: true,
};

export const groupProductColumns = [
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
  'timestamp.deletedAt',
];
export const groupProductsSortableColumns: string[] = groupProductColumns.map(
  (val) => `${val}`,
);

export const groupProductsSearchableColumns: string[] = groupProductColumns.map(
  (val) => `${val}`,
);
