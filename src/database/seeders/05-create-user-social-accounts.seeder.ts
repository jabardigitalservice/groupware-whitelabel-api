import { User } from '../../models/users/entities/user.entity';
import { Factory, Seeder } from 'typeorm-seeding';
import { UserSocialAccount } from '../../models/user-social-accounts/entities/user-social-account.entity';
import { createQueryBuilder, getRepository } from 'typeorm';

export default class CreateUserSocialAccounts implements Seeder {
  public async run(factory: Factory): Promise<any> {
    const userSocialAccountRepository = getRepository(UserSocialAccount);
    const userRepository = getRepository(User);

    const defaultAdmin = await userRepository.findOne({
      email: process.env.DEFAULT_ADMIN_EMAIL,
    });

    const isUserSocialAccountExist = await userSocialAccountRepository.findOne({
      where: { userId: defaultAdmin.id, providerName: 'google' },
    });

    if (!isUserSocialAccountExist) {
      await userSocialAccountRepository.save({
        providerIdentifier: process.env.DEFAULT_ADMIN_EMAIL,
        providerName: 'google',
        user: defaultAdmin,
      });
    }

    const providerName = ['google', 'keyclock'];
    const users = await userRepository.find({
      relations: ['userSocialAccounts'],
    });

    for (const user of users) {
      if (user.email == process.env.DEFAULT_ADMIN_EMAIL) {
        continue;
      }

      for (let i = 0; i < Math.floor(Math.random() * 2) + 1; i++) {
        if (
          user.userSocialAccounts.find((x) => x.providerName == providerName[i])
        ) {
          continue;
        }

        await factory(UserSocialAccount)().create({
          providerIdentifier: user.email,
          providerName: providerName[i],
          user,
        });
      }
    }
  }
}
