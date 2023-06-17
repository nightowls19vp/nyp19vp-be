import { IPaginateFilterableColumns } from 'libs/shared/src/lib/common/nest-paginate-decorators/interfaces/filter.interface';

export const storageLocationsColumns = [
  'id',
  'name',
  'addedBy',
  'description',
  'timestamp.createdAt',
  'timestamp.updatedAt',
  'timestamp.deletedAt',
];

// map array of strings to object with keys of strings and values of `true`
export const storageLocationsFilterableColumns: IPaginateFilterableColumns =
  storageLocationsColumns.reduce((acc, val) => ({ ...acc, [val]: true }), {});

export const storageLocationsSortableColumns: string[] =
  storageLocationsColumns.map((val) => `${val}`);

export const storageLocationsSearchableColumns: string[] =
  storageLocationsColumns.map((val) => `${val}`);
