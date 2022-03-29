import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Token } from '../enums/token.enum';
import { User } from './user.entity';

@Entity('user_tokens')
export class UserToken {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @ManyToOne(() => User, (user) => user.userTokens)
  @JoinColumn({ name: 'user_id' })
  public user!: User;

  @Column({
    type: 'varchar',
    name: 'token',
    length: 255,
    nullable: false,
  })
  public token: string;

  @Column('enum', {
    enum: Token,
    name: 'token_type',
    default: Token.REFRESH,
    nullable: false,
  })
  public tokenType: Token;

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
