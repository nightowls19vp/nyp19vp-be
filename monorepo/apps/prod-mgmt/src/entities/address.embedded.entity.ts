import { Column } from 'typeorm';

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
    name: 'province_code',
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
  })
  provinceCode: string;

  @Column({
    name: 'province_name',
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
  })
  provinceName: string;

  @Column({
    name: 'district_code',
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
  })
  districtCode: string;

  @Column({
    name: 'district_name',
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
  })
  districtName: string;

  @Column({
    name: 'ward_code',
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
  })
  wardCode: string;

  @Column({
    name: 'ward_name',
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
  })
  wardName: string;
}
