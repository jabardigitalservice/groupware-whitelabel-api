import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('user_profiles')
export class UserProfile {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @OneToOne(() => User, (user) => user.userProfile)
  @JoinColumn({ name: 'user_id' })
  public user: User;

  @Column({ type: 'date', name: 'birth_date', nullable: true })
  public birthDate: Date;

  @Column({ type: 'varchar', name: 'birth_place', length: 192, nullable: true })
  public birthPlace: string;

  @Column({ type: 'char', length: 1, nullable: true })
  public gender: string;

  @Column({ type: 'varchar', name: 'avatar', length: 255, nullable: true })
  public avatar?: string;

  @Column({
    type: 'varchar',
    name: 'employment_status',
    length: 20,
    nullable: true,
  })
  public employmentStatus: string;

  @Column({ name: 'is_pns', type: 'boolean', nullable: true })
  public isPns: boolean;
}
