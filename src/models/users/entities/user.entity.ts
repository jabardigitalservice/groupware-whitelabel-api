import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
  BeforeInsert,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { UserProfile } from '../../user-profiles/entities/user-profile.entity';
import { UserSocialAccount } from '../../user-social-accounts/entities/user-social-account.entity';
import { UserToken } from './user-token.entity';
import { Attendance } from '../../attendances/entities/attendance.entity';
import { Logbook } from '../../logbooks/entities/logbooks.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  public name: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  public email: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  public password: string;

  @BeforeInsert() async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  public isActive: boolean;

  @OneToMany(() => Logbook, (logbook) => logbook.project)
  public logbooks: Logbook[];

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

  @OneToOne(() => UserProfile, (userProfile) => userProfile.user)
  public userProfile: UserProfile;

  @OneToMany(
    () => UserSocialAccount,
    (userSocialAccount) => userSocialAccount.user,
  )
  public userSocialAccounts: UserSocialAccount[];

  @OneToMany(() => UserToken, (userToken) => userToken.user)
  public userTokens: UserToken[];

  @OneToMany(() => Attendance, (attendance) => attendance.user)
  public attendances: Attendance[];
}
