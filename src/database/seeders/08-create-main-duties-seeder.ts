import { Factory, Seeder } from 'typeorm-seeding';
import { createQueryBuilder } from 'typeorm';
import { JobTitle } from '../../models/job-titles/entities/job-titles.entity';
import { MainDuty } from '../../models/main_duties/entities/main_duties.entity';
import { faker } from '@faker-js/faker';

export default class CreateMainDuties implements Seeder {
  public async run(factory: Factory): Promise<any> {
    const jobTitles = await createQueryBuilder()
      .from(JobTitle, 'job_titles')
      .execute();

    for (const jobTitle of jobTitles) {
      for (let i = 0; i < Math.floor(Math.random() * 3) + 1; i++) {
        await factory(MainDuty)().create({
          jobTitleId: jobTitle.id,
          name: faker.company.catchPhraseAdjective(),
          sequence: i + 1,
          occupationTarget: Math.floor(Math.random() * 7) + 1,
        });
      }
    }
  }
}
