import { IPaginateFilterableColumns } from 'libs/shared/src/lib/common/nest-paginate-decorators/interfaces/filter.interface';

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

const columns = [
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
];
export const sortableColumns: string[] = columns.map((val) => `${val}`);

export const searchableColumns: string[] = columns.map((val) => `${val}`);
