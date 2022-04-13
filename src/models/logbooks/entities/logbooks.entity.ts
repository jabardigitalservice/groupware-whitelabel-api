import { MainDuty } from '../../main-duties/entities/main-duties.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Projects } from '../../projects/entities/projects.entity';
import { User } from '../../users/entities/user.entity';

@Entity({
  name: 'logbooks',
})
export class Logbook {
  @PrimaryGeneratedColumn('uuid')
  public id?: string;

  @Column({
    type: 'uuid',
    nullable: false,
    name: 'project_id',
  })
  public projectId!: string;

  @ManyToOne(() => Projects, (project) => project.logbooks)
  @JoinColumn({
    name: 'project_id',
  })
  public project?: Projects;

  @Column({
    type: 'uuid',
    nullable: false,
    name: 'main_duty_id',
  })
  public mainDutyId?: string;

  @ManyToOne(() => MainDuty, (mainDuty) => mainDuty.logbooks)
  @JoinColumn({
    name: 'main_duty_id',
  })
  public mainDuty?: MainDuty;

  @Column({
    type: 'uuid',
    nullable: false,
    name: 'user_id',
  })
  public userId!: string;

  @ManyToOne(() => User, (user) => user.logbooks)
  @JoinColumn({
    name: 'user_id',
  })
  public user?: User;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    name: 'name_task',
  })
  public nameTask!: string;

  @Column({
    type: 'timestamp',
    nullable: false,
    name: 'date_task',
  })
  public dateTask!: Date;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    name: 'evidence_task_url',
  })
  public evidenceTaskUrl!: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    name: 'evidence_task_path',
  })
  public evidenceTaskPath!: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    name: 'link_attachment',
  })
  public linkAttachment!: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    name: 'workplace',
  })
  public workplace?: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    name: 'organizer',
  })
  public organizer?: string;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'created_at',
    nullable: false,
  })
  public createdAt?: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    name: 'updated_at',
    nullable: false,
  })
  public updatedAt?: Date;

  @Column({
    type: 'timestamp',
    name: 'deleted_at',
    nullable: true,
  })
  public deletedAt?: Date;
}
