import { User } from '../../users/entities/user.entity';
import { Seeder } from 'typeorm-seeding';
import { UserSocialAccount } from '../../user-social-accounts/user-social-account.entity';
import { getRepository } from 'typeorm';

export default class CreateUserSocialAccounts implements Seeder {
  public async run(): Promise<any> {
    const userSocialAccountRepository = getRepository(UserSocialAccount);
    const userRepository = getRepository(User);

    const user = await userRepository.findOne({
      email: 'groupware.whitelabel@gmail.com',
    });

    await userSocialAccountRepository.save({
      providerIdentifier: 'groupware.whitelabel@gmail.com',
      providerName: 'google',
      user: user,
    });

    // const providerName = ['facebook', 'google', 'github', 'keyclock'];
    // const users = await createQueryBuilder()
    //   .select('id')
    //   .from(User, 'user')
    //   .execute();

    // for (const user of users) {
    //   if (user.email == user.email) {
    //     continue;
    //   }

    //   for (let i = 0; i < Math.floor(Math.random() * 4) + 1; i++) {
    //     await factory(UserSocialAccount)().create({
    //       providerName: providerName[i],
    //       user,
    //     });
    //   }
    // }
  }
}
