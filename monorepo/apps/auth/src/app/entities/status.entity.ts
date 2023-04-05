import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';

import { AccountEntity } from './account.entity';

export enum E_STATUS {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Entity({
  name: 'status',
})
export class StatusEntity {
  @OneToOne(() => AccountEntity, (account) => account.status, {
    onDelete: 'CASCADE',
    eager: false,
  })
  @JoinColumn({
    name: 'account_id',
  })
  account: AccountEntity;

  @PrimaryColumn({
    name: 'account_id',
  })
  account_id: string;

  @Column({
    name: 'status',
    type: 'enum',
    enum: E_STATUS,
    default: E_STATUS.ACTIVE,
  })
  name: E_STATUS;

  @Column({
    name: 'last_login',
    default: null,
  })
  lastLogin: Date;

  @Column({
    name: 'last_logout',
    default: null,
  })
  lastLogout: Date;
}
