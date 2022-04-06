import { MainDuty } from '../../main_duties/entities/main_duties.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { UserProfile } from '../../user-profiles/entities/user-profile.entity';

@Entity({
  name: 'job_titles',
})
export class JobTitle {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  public name: string;

  @Column({ type: 'text', nullable: true })
  public description: string;

  @OneToMany(() => MainDuty, (mainDuty) => mainDuty.jobTitle)
  public mainDuties: MainDuty[];

  @OneToMany(() => UserProfile, (userProfile) => userProfile.jobTitle)
  public userProfiles: UserProfile[];

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
