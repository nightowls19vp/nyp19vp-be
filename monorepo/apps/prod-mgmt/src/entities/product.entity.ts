import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

import { TimestampEmbeddedEntity } from './timestamp.embedded.entity';
import { GroupProductEntity } from './group-product.entity';

@Entity({
  name: 'products',
})
export class ProductEntity {
  @PrimaryColumn({
    name: 'id',
    type: 'uuid',
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
    generated: 'uuid',
  })
  id: string;

  @Column({
    name: 'name',
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
    default: '',
  })
  name: string;

  @Column({
    name: 'image',
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
    nullable: true,
    default: null,
  })
  image: string;

  @Column({
    name: 'barcode',
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
    unique: true,
    nullable: true,
    default: null,
  })
  barcode: string;

  @Column({
    name: 'price',
    nullable: true,
    default: null,
  })
  price: number;

  @Column({
    name: 'region',
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
    nullable: true,
    default: null,
  })
  region: string;

  @Column({
    name: 'brand',
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
    nullable: true,
    default: null,
  })
  brand: string;

  @Column({
    name: 'category',
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
    nullable: true,
    default: null,
  })
  category: string;

  @Column({
    name: 'description',
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
    nullable: true,
    default: null,
  })
  description: string;

  @OneToMany(() => GroupProductEntity, (groupProduct) => groupProduct.product, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    lazy: true,
  })
  groupProducts: Promise<GroupProductEntity[]>;

  @Column(() => TimestampEmbeddedEntity, {
    prefix: false,
  })
  timestamp: TimestampEmbeddedEntity;
}
