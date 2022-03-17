import { UserProfile } from 'src/user-profiles/user-profile.entity';
import { User } from 'src/users/entities/user.entity';
import { Factory, Seeder } from 'typeorm-seeding';
import { createQueryBuilder } from 'typeorm';

export default class CreateUserProfiles implements Seeder {
  public async run(factory: Factory): Promise<any> {
    const users = await createQueryBuilder()
      .select('id')
      .from(User, 'user')
      .execute();

    for (const user of users) {
      await factory(UserProfile)().create({
        user,
      });
    }
  }
}
