import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { SOCIAL_MEDIA_ACCOUNT } from '../constants/entities/index';
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

  @ManyToOne(() => AccountEntity, (user) => user.socialAccounts)
  @JoinColumn({
    name: 'account_id',
  })
  account: AccountEntity;
}
