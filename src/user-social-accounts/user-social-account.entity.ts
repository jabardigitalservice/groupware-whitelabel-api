import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/entities/user.entity';

@Entity()
export class UserSocialAccount {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @ManyToOne(() => User, (user) => user.userSocialAccounts)
  @JoinColumn({ name: 'user_id' })
  public user!: User;

  @Column({
    type: 'varchar',
    name: 'provider_identifier',
    length: 192,
    nullable: false,
  })
  public providerIdentifier: string;

  @Column({
    type: 'varchar',
    name: 'provider_name',
    length: 192,
    nullable: false,
  })
  public providerName: string;

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
