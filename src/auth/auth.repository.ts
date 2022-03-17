import { User } from 'src/users/entities/user.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(User)
export class AuthRepository extends Repository<User> {
  async findByEmail(email: string): Promise<User> {
    return this.findOne({ where: { email } });
  }
}
