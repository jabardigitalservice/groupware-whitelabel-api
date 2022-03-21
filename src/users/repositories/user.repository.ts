import { EntityRepository, Repository } from 'typeorm';
import { GetUsersFilterDto } from '../dto/get-users-filter.dto';
import { User } from '../entities/user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async assignRole(userId: number, roleId: number): Promise<void> {
    await this.createQueryBuilder()
      .relation(User, 'roles')
      .of(userId)
      .add(roleId);
  }

  getUsers(getUsersFilterDto: GetUsersFilterDto): Promise<User[]> {
    const { name } = getUsersFilterDto;

    const query = this.createQueryBuilder('user')
      .select([
        'user.id AS id',
        'user.name AS name',
        'userProfile.avatar AS avatar',
      ])
      .innerJoin('user.userProfile', 'userProfile')
      .where('user.deleted_at IS NULL')
      .orderBy('user.name', 'ASC');

    if (name) {
      query.andWhere('LOWER(user.name) LIKE LOWER(:name)', {
        name: `%${name}%`,
      });
    }

    return query.getRawMany();
  }
}
