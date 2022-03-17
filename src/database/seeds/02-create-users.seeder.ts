import { User } from 'src/users/entities/user.entity';
import { Factory, Seeder } from 'typeorm-seeding';
import { getRepository } from 'typeorm';

export default class CreateUsers implements Seeder {
  public async run(factory: Factory): Promise<any> {
    const userRepository = getRepository(User);

    const user = new User();
    user.name = 'Groupware Whitelabel Admin';
    user.email = 'groupware.whitelabel@gmail.com';
    user.password = '123456';
    user.isActive = true;
    await userRepository.save(user);

    await factory(User)().createMany(10);
  }
}
