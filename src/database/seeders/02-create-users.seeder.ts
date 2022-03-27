import { User } from '../../models/users/entities/user.entity';
import { Factory, Seeder } from 'typeorm-seeding';
import { getRepository } from 'typeorm';

export default class CreateUsers implements Seeder {
  public async run(factory: Factory): Promise<any> {
    const userRepository = getRepository(User);

    const user = new User();
    user.name = process.env.DEFAULT_ADMIN_NAME;
    user.email = process.env.DEFAULT_ADMIN_EMAIL;
    user.password = process.env.DEFAULT_PASSWORD;
    user.isActive = true;
    await userRepository.save(user);

    await factory(User)().createMany(10);
  }
}
