import { IPaginateFilterableColumns } from 'libs/shared/src/lib/common/nest-paginate-decorators/interfaces/filter.interface';

export const purchaseLocationsColumns = [
  'id',
  'name',
  'addedBy',
  'description',
  'address.provinceName',
  'address.districtName',
  'address.wardName',
  'address.addressLine1',
  'address.addressLine2',
  'timestamp.createdAt',
  'timestamp.updatedAt',
  'timestamp.deletedAt',
];

// map array of strings to object with keys of strings and values of `true`
export const purchaseLocationsFilterableColumns: IPaginateFilterableColumns =
  purchaseLocationsColumns.reduce((acc, val) => ({ ...acc, [val]: true }), {});

export const purchaseLocationsSortableColumns: string[] =
  purchaseLocationsColumns.map((val) => `${val}`);

export const purchaseLocationsSearchableColumns: string[] =
  purchaseLocationsColumns.map((val) => `${val}`);
