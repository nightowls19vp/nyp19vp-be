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
  })
  username: string;

  @Column({
    name: 'hashed_password',
  })
  hashedPassword: string;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
  })
  deletedAt: Date;

  @OneToOne(() => StatusEntity, {
    cascade: true,
  })
  @JoinColumn()
  status: StatusEntity;

  @ManyToOne(() => RoleEntity, (role) => role.accounts, {
    cascade: true,
  })
  role: RoleEntity;

  @OneToMany(
    () => RefreshTokenBlacklistEntity,
    (refreshTokenBlacklist) => refreshTokenBlacklist.account,
  )
  refreshTokenBlacklist: RefreshTokenBlacklistEntity[];
}
