import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';

import { GroupEntity } from './group.entity';
import { ProductEntity } from './product.entity';
import { TimestampEmbeddedEntity } from './timestamp.embedded.entity';
import { ItemEntity } from './item.entity';

@Entity({
  name: 'group_products',
})
export class GroupProductEntity {
  @PrimaryColumn({
    name: 'id',
    type: 'uuid',
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
    generated: 'uuid',
  })
  id: string;

  @ManyToOne(() => GroupEntity, (group) => group.groupProducts, {
    nullable: false,
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({
    name: 'group_id',
  })
  group: GroupEntity;

  @ManyToOne(() => ProductEntity, (product) => product.groupProducts, {
    nullable: false,
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({
    name: 'product_id',
  })
  product: ProductEntity;

  @Column({
    name: 'custom_name',
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
  })
  customName: string;

  @Column({
    name: 'custom_image',
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
  })
  customImage: string;

  @Column({
    name: 'custom_price',
  })
  customPrice: number;

  @Column({
    name: 'custom_description',
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
  })
  customDescription: string;

  @Column(() => TimestampEmbeddedEntity, {
    prefix: false,
  })
  timestamp: TimestampEmbeddedEntity;

  @OneToMany(() => ItemEntity, (item) => item.groupProduct, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    lazy: true,
  })
  items: Promise<ItemEntity[]>;
}
