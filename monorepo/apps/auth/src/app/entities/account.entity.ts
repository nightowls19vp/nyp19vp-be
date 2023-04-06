import { randomUUID } from 'crypto';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { ACCOUNT } from '../constants/entities';
import { RefreshTokenBlacklistEntity } from './refresh-token-blacklist.entity';
import { RoleEntity } from './role.entity';
import { TimestampEmbeddedEntity } from './timestamp.embedded.entity';

import { StatusEntity } from './status.entity';
import { SocialAccountEntity } from './social-media-account.entity';

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

  @OneToOne(() => StatusEntity, (status) => status.account, {
    cascade: true,
    eager: true,
  })
  status: StatusEntity;

  @ManyToOne(() => RoleEntity, {
    cascade: false,
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

  @OneToMany(
    () => SocialAccountEntity,
    (socialMediaAccount) => socialMediaAccount.account,
    {
      lazy: true,
      cascade: true,
    },
  )
  socialAccounts: Promise<SocialAccountEntity[]>;
}
