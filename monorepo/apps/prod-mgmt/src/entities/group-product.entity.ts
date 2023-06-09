import {
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';

import { GroupEntity } from './group.entity';
import { ItemEntity } from './item.entity';
import { ProductEntity } from './product.entity';

@Entity({
  name: 'group_products',
})
export class GroupProductEntity extends ProductEntity {
  @PrimaryColumn({
    name: 'id',
    type: 'uuid',
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
    generated: 'uuid',
    primaryKeyConstraintName: 'PK_group_products_id',
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

  @OneToMany(() => ItemEntity, (item) => item.groupProduct, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    lazy: true,
  })
  items: Promise<ItemEntity[]>;
}
