import { JobTitle } from 'src/models/job-titles/entities/job-titles.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

@Entity({
  name: 'main_duties',
})
export class MainDuty {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ type: 'uuid', nullable: false, name: 'job_title_id' })
  public jobTitleId!: string;

  @ManyToOne(() => JobTitle, (jobTitle) => jobTitle.mainDuties)
  @JoinColumn({ name: 'job_title_id' })
  public jobTitle: JobTitle;

  @Column({ type: 'varchar', length: 255, nullable: false })
  public name: string;

  @Column({ type: 'integer', nullable: false })
  public sequence: number;

  @Column({ type: 'integer', name: 'occupation_target', nullable: true })
  public occupationTarget: number;

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
  })
  public updatedAt: Date;

  @Column({
    type: 'timestamp',
    name: 'deleted_at',
    nullable: true,
  })
  public deletedAt?: Date;
}
