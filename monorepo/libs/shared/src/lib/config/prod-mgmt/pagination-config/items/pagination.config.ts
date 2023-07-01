import { IPaginateFilterableColumns } from 'libs/shared/src/lib/common/nest-paginate-decorators/interfaces/filter.interface';
import { FilterOperator } from 'nestjs-paginate';

export const itemsColumns = [
  // ItemEntity
  'id',
  'timestamp.createdAt',
  'timestamp.updatedAt',
  'timestamp.deletedAt',

  // GroupProductEntity
  'groupProduct.id',
  'groupProduct.barcode',
  'groupProduct.name',
  'groupProduct.category',
  'groupProduct.brand',
  'groupProduct.description',
  'groupProduct.price',
  'groupProduct.region',

  'purchaseLocation.id',

  'storageLocation.id',
];

// map array of strings to object with keys of strings and values of `true`
// but, for `purchaseLocation.id` and `storageLocation.id`, the values is `FilterOperator.EQ`
export const itemsFilterableColumns: IPaginateFilterableColumns = {
  ...itemsColumns.reduce((acc, val) => ({ ...acc, [val]: true }), {}),
  'purchaseLocation.id': [FilterOperator.EQ],
  'storageLocation.id': [FilterOperator.EQ],
};

export const itemsSortableColumns: string[] = itemsColumns.map(
  (val) => `${val}`,
);

export const itemsSearchableColumns: string[] = itemsColumns
  .filter(
    (val) =>
      !val.includes('timestamp.') ||
      !val.startsWith('id') ||
      !val.endsWith('id'),
  )
  .map((val) => `${val}`);
