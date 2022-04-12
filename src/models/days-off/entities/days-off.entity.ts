import { User } from '../../users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('days_off')
export class DaysOff {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @ManyToOne(() => User, (user) => user.daysoff)
  @JoinColumn({ name: 'user_id' })
  public user!: User;

  @Column({
    type: 'timestamp',
    name: 'start_date',
    nullable: false,
  })
  startDate: Date;

  @Column({
    type: 'timestamp',
    name: 'end_date',
    nullable: false,
  })
  endDate: Date;

  @Column({
    type: 'varchar',
    name: 'permits_type',
    length: 20,
    nullable: false,
  })
  permitsType: string;

  @Column({
    type: 'varchar',
    name: 'permit_acknowledged',
    length: 255,
    array: true,
    nullable: false,
  })
  permitAcknowledged: string[];

  @Column({
    type: 'text',
    name: 'note',
    nullable: false,
  })
  note: string;

  @Column({
    type: 'varchar',
    name: 'file_path',
    length: 255,
    nullable: false,
  })
  filePath: string;

  @Column({
    type: 'varchar',
    name: 'file_url',
    length: 255,
    nullable: false,
  })
  fileUrl: string;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'created_at',
    nullable: false,
  })
  public createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    name: 'updated_at',
    nullable: false,
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  public updatedAt: Date;
}
