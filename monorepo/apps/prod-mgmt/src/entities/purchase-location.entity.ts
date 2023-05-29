import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { GroupEntity } from './group.entity';
import { AddressEmbeddedEntity } from './address.embedded.entity';
import { TimestampEmbeddedEntity } from './timestamp.embedded.entity';
import { ItemEntity } from './item.entity';

@Entity({
  name: 'purchase_locations',
})
export class PurchaseLocationEntity {
  @PrimaryColumn({
    name: 'id',
    type: 'uuid',
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
    generated: 'uuid',
  })
  id: string;

  @ManyToOne(() => GroupEntity, (group) => group.purchaseLocations, {
    nullable: false,
    onDelete: 'CASCADE',
    eager: true,
  })
  group: GroupEntity;

  @Column({
    name: 'name',
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
  })
  name: string;

  @Column({
    name: 'added_by',
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
    comment: 'user info id - mongo id',
  })
  addedBy: string;

  @OneToMany(() => ItemEntity, (item) => item.purchaseLocation, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    lazy: true,
  })
  items: Promise<ItemEntity[]>;

  @Column(() => AddressEmbeddedEntity, {
    prefix: false,
  })
  address: AddressEmbeddedEntity;

  @Column(() => TimestampEmbeddedEntity, {
    prefix: false,
  })
  timestamp: TimestampEmbeddedEntity;
}
