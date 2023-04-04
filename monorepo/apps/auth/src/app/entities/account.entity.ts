import { randomUUID } from 'crypto';
import { RoleEntity } from './role.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { StatusEntity } from './status.entity';
import { RefreshTokenBlacklistEntity } from './refresh-token-blacklist.entity';
import { ACCOUNT } from '../constants/entities';
import { TimestampEmbeddedEntity } from './timestamp.embedded.entity';

@Entity({
  name: ACCOUNT,
})
export class AccountEntity {
  @PrimaryGeneratedColumn('uuid', {
    name: 'id',
  })
  id: string;

  @Column({
    name: 'username',
    unique: true,
    default: randomUUID(),
  })
  username: string;

  @Column({
    name: 'email',
    unique: true,
    nullable: false,
  })
  email: string;

  @Column({
    name: 'hashed_password',
    nullable: false,
  })
  hashedPassword: string;

  @Column(() => TimestampEmbeddedEntity, {
    prefix: false,
  })
  timestamp: TimestampEmbeddedEntity;

  @OneToOne(() => StatusEntity, {
    cascade: true,
    eager: true,
  })
  @JoinColumn()
  status: StatusEntity;

  @ManyToOne(() => RoleEntity, (role) => role.accounts, {
    cascade: true,
    eager: true,
  })
  @JoinColumn({
    name: 'role_id',
  })
  role: RoleEntity;

  @OneToMany(
    () => RefreshTokenBlacklistEntity,
    (refreshTokenBlacklist) => refreshTokenBlacklist.account,
    {
      lazy: true,
    },
  )
  refreshTokenBlacklist: Promise<RefreshTokenBlacklistEntity[]>;
}
