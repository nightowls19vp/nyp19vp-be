import { ActionEntity } from './action.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AccountEntity } from './account.entity';
import { ERole } from '@nyp19vp-be/shared';
import { ROLE } from '../constants/entities';

@Entity({
  name: ROLE,
})
export class RoleEntity {
  @PrimaryGeneratedColumn('increment', {
    name: 'id',
  })
  id: number;

  @Column({
    name: 'role_name',
    type: 'enum',
    enum: ERole,
    default: ERole.user,
  })
  name: ERole;

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

  @OneToMany(() => AccountEntity, (account) => account.role)
  accounts: AccountEntity[];

  @ManyToMany(() => ActionEntity, (action) => action.roles)
  actions: ActionEntity[];
}
