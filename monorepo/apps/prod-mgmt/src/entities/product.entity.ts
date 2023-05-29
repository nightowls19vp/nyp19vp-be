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
  })
  name: string;

  @Column({
    name: 'image',
  })
  image: string;

  @Column({
    name: 'barcode',
  })
  barcode: string;

  @Column({
    name: 'price',
  })
  price: number;

  @Column({
    name: 'region',
  })
  region: string;

  @Column({
    name: 'brand',
  })
  brand: string;

  @Column({
    name: 'category',
  })
  category: string;

  @Column({
    name: 'description',
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
