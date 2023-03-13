import { REFRESH_TOKEN_BLACKLIST } from '../constants/entities/index';
import { Entity, ManyToOne, Column, JoinColumn, PrimaryColumn } from 'typeorm';
import { AccountEntity } from './account.entity';
@Entity({
  name: REFRESH_TOKEN_BLACKLIST,
})
export class RefreshTokenBlacklistEntity {
  @ManyToOne(() => AccountEntity, (user) => user.refreshTokenBlacklist)
  @JoinColumn({
    name: 'account_id',
  })
  account: AccountEntity;

  @PrimaryColumn({
    name: 'account_id',
  })
  userId: string;

  @PrimaryColumn({
    name: 'token',
    nullable: false,
  })
  token: string;

  @Column('timestamp', {
    name: 'expired_at',
  })
  expiredAt: Date;
}
