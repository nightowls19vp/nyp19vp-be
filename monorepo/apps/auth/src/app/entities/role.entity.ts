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

@Entity({
  name: 'roles',
})
export class RoleEntity {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  id: string;

  @Column({
    name: 'role_name',
  })
  name: string;

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
