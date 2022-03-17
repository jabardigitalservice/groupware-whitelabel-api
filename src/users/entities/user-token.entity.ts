import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class UserToken {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @OneToOne(() => User, (user) => user.userToken)
  @JoinColumn({ name: 'user_id' })
  public user!: User;

  @Column({
    type: 'varchar',
    name: 'refresh_token',
    length: 255,
    nullable: false,
  })
  public refreshToken: string;

  @Column({
    type: 'int',
    name: 'expired_time',
    nullable: false,
  })
  public expiredTime: number;

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
}
