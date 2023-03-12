import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ACTION } from '../constants/entities';
import { RoleEntity } from './role.entity';

@Entity({
  name: ACTION,
})
export class ActionEntity {
  @PrimaryGeneratedColumn('uuid', {
    name: 'id',
  })
  id: string;

  @Column({
    name: 'aciton_name',
  })
  name: string;

  @ManyToMany(() => RoleEntity, (role) => role.actions, {
    cascade: true,
  })
  @JoinTable({
    name: 'required_roles_for_actions',
  })
  roles: RoleEntity[];
}
