import { Column, VirtualColumn } from 'typeorm';

export class AddressEmbeddedEntity {
  @Column({
    name: 'address_line_1',
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
  })
  addressLine1: string;

  @Column({
    name: 'address_line_2',
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
    nullable: true,
    default: null,
  })
  addressLine2?: string;

  @Column({
    name: 'province_name',
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
  })
  provinceName: string;

  @Column({
    name: 'district_name',
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
  })
  districtName: string;

  @Column({
    name: 'ward_name',
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
  })
  wardName: string;

  // @VirtualColumn({
  //   query(alias) {
  //     return `${alias}.address_line_1, ${alias}.address_line_2, ${alias}.ward_name, ${alias}.district_name, ${alias}.province_name`;
  //   },
  //   type: 'varchar',
  // })
  // full: string;
}
