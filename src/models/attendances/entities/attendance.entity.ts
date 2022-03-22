import { User } from '../../../users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('attendances')
export class Attendance {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @ManyToOne(() => User, (user) => user.attendances)
  @JoinColumn({ name: 'user_id' })
  public user!: User;

  @Column({
    type: 'timestamp without time zone',
    name: 'start_date',
    nullable: false,
  })
  startDate: Date;

  @Column({
    type: 'timestamp without time zone',
    name: 'end_date',
    nullable: true,
  })
  endDate: Date;

  @Column({
    type: 'float',
    name: 'office_hours',
    nullable: true,
  })
  officeHours: number;

  @Column({
    type: 'varchar',
    name: 'location',
    length: 100,
    nullable: false,
  })
  location: string;

  @Column({
    type: 'varchar',
    name: 'mood',
    length: 50,
    nullable: true,
  })
  mood: string;

  @Column({
    type: 'text',
    name: 'note',
    nullable: true,
  })
  note: string;

  @CreateDateColumn({
    type: 'timestamp without time zone',
    name: 'created_at',
    nullable: false,
  })
  public createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp without time zone',
    name: 'updated_at',
    nullable: false,
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  public updatedAt: Date;
}
