import { EntityRepository, Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async assignRole(userId: number, roleId: number): Promise<void> {
    await this.createQueryBuilder()
      .relation(User, 'roles')
      .of(userId)
      .add(roleId);
  }
}
