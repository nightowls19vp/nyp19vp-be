import { AccountEntity } from './account.entity';
import { Column, Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, PrimaryColumn } from 'typeorm';

export enum E_STATUS {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Entity({
  name: 'status',
})
export class StatusEntity {
  @OneToOne(() => AccountEntity, (account) => account.status)
  @JoinColumn({
    name  : "account_id"
  })

  @PrimaryColumn({
    name: "account_id"
  })
  account_id: string

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
