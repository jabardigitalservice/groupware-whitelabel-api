import { UserProfile } from '../../models/user-profiles/entities/user-profile.entity';
import { User } from '../../models/users/entities/user.entity';
import { Factory, Seeder } from 'typeorm-seeding';
import { createQueryBuilder, getRepository } from 'typeorm';

export default class CreateUserProfiles implements Seeder {
  public async run(factory: Factory): Promise<any> {
    const users = await getRepository(User).find({
      relations: ['userProfile'],
    });

    for (const user of users) {
      if (user.userProfile === null) {
        await factory(UserProfile)().create({
          user,
        });
      }
    }
  }
}
