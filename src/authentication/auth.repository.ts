import { User } from '../models/users/entities/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { InternalServerErrorException } from '@nestjs/common';

@EntityRepository(User)
export class AuthRepository extends Repository<User> {
  async findByEmail(email: string): Promise<User> {
    try {
      return this.findOne({ where: { email } });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findById(id: string): Promise<User> {
    try {
      return this.findOne({ where: { id } });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async changePassword(id: string, password: string): Promise<any> {
    try {
      return this.update(id, { password });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
