import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { DistrictEntity } from './district.entity';

@Entity('wards')
export class WardEntity {
  @PrimaryColumn({
    name: 'code',
    type: 'int',
    generated: 'increment',
  })
  code: number;

  @Column({
    name: 'name',
    charset: 'utf8mb4',
    collation: 'utf8mb4_0900_ai_ci',
  })
  name: string;

  @Column({
    charset: 'utf8mb4',
    collation: 'utf8mb4_0900_ai_ci',
  })
  division_type: string;

  @Column({
    charset: 'utf8mb4',
    collation: 'utf8mb4_0900_ai_ci',
  })
  codename: string;

  @ManyToOne(() => DistrictEntity, (district) => district.wards, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'district_code' })
  district: DistrictEntity;
}
