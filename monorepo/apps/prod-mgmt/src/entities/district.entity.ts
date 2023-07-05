import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  JoinColumn,
} from 'typeorm';
import { ProvinceEntity } from './province.entity';
import { WardEntity } from './ward.entity';

@Entity('districts')
export class DistrictEntity {
  @PrimaryColumn({
    name: 'code',
    type: 'int',
    generated: 'increment',
  })
  code: number;

  @Column({
    type: 'varchar',
    length: 255,
    charset: 'utf8mb4',
    collation: 'utf8mb4_0900_ai_ci',
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 255,
    charset: 'utf8mb4',
    collation: 'utf8mb4_0900_ai_ci',
  })
  division_type: string;

  @Column({
    type: 'varchar',
    length: 255,
    charset: 'utf8mb4',
    collation: 'utf8mb4_0900_ai_ci',
  })
  codename: string;

  @ManyToOne(() => ProvinceEntity, (province) => province.districts, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'province_code' })
  province: ProvinceEntity;

  @OneToMany(() => WardEntity, (ward) => ward.district, {
    lazy: true,
  })
  wards: Promise<WardEntity[]>;
}
