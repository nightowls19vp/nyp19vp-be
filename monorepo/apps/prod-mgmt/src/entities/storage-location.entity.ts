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
    unique: true,
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
    nullable: true,
    default: null,
  })
  name: string;

  @Column({
    name: 'added_by',
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
    comment: 'user info id - mongo id',
    nullable: true,
    default: null,
  })
  addedBy: string;

  @Column({
    name: 'image',
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
    nullable: true,
    default: null,
  })
  image: string;

  @Column({
    name: 'description',
    type: 'text',
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
    nullable: true,
    default: null,
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
