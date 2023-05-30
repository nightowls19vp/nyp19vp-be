import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { GroupEntity } from './group.entity';
import { TimestampEmbeddedEntity } from './timestamp.embedded.entity';
import { ItemEntity } from './item.entity';

@Entity({
  name: 'storage_locations',
})
export class StorageLocationEntity {
  @PrimaryColumn({
    name: 'id',
    type: 'uuid',
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
    generated: 'uuid',
  })
  id: string;

  @ManyToOne(() => GroupEntity, (group) => group.storageLocations, {
    nullable: false,
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({
    name: 'group_id',
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

  @Column({
    name: 'image',
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
  })
  image: string;

  @Column({
    name: 'description',
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
  })
  description: string;

  @ManyToOne(() => ItemEntity, (item) => item.storageLocation, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    lazy: true,
  })
  items: Promise<ItemEntity[]>;

  @Column(() => TimestampEmbeddedEntity, {
    prefix: false,
  })
  timestamp: TimestampEmbeddedEntity;
}
