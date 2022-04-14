import { JobTitle } from '../../models/job-titles/entities/job-titles.entity';
import { Factory, Seeder } from 'typeorm-seeding';
import { getRepository } from 'typeorm';
import { User } from 'src/models/users/entities/user.entity';
import { UserProfile } from 'src/models/user-profiles/entities/user-profile.entity';

export default class CreateJobTitles implements Seeder {
  public async run(factory: Factory): Promise<any> {
    await factory(JobTitle)().createMany(10);
    const userRepository = getRepository(User);
    const userProfileRepository = getRepository(UserProfile);
    const jobTitleRepository = getRepository(JobTitle);

    const users = await userRepository.find({
      relations: ['userProfile', 'userProfile.jobTitle'],
    });

    const jobTitle = await jobTitleRepository.find();

    for (const user of users) {
      if (user.userProfile.jobTitle === null) {
        const assignUser = await userProfileRepository.findOne({
          where: { user: user },
        });
        assignUser.jobTitleId =
          jobTitle[Math.floor(Math.random() * jobTitle.length)].id;
        await userProfileRepository.save(assignUser);
      }
    }
  }
}
