import { SOCIAL_MEDIA_ACCOUNT } from '../constants/entities/index';
import { Entity, ManyToOne, Column, JoinColumn, PrimaryColumn } from 'typeorm';
import { AccountEntity } from './account.entity';
@Entity({
  name: SOCIAL_MEDIA_ACCOUNT,
})
export class SocialMediaAccountEntity {
  @PrimaryColumn({
    name: 'platform',
    nullable: false,
  })
  platform: string;

  @PrimaryColumn({
    name: 'platform_id',
  })
  platform_id: string;

  @PrimaryColumn({
    name: 'token',
    nullable: false,
  })
  token: string;

  @Column('timestamp', {
    name: 'expired_at',
  })
  expiredAt: Date;

  @ManyToOne(() => AccountEntity, (user) => user.refreshTokenBlacklist)
  @JoinColumn({
    name: 'account_id',
  })
  account: AccountEntity;
}
