import { Seeder } from 'typeorm-seeding';
import { createQueryBuilder } from 'typeorm';
import { JobTitle } from '../../models/job-titles/entities/job-titles.entity';
import { MainDuty } from '../../models/main-duties/entities/main-duties.entity';
import { faker } from '@faker-js/faker';

export default class CreateMainDuties implements Seeder {
  public async run(): Promise<any> {
    const jobTitles = await createQueryBuilder()
      .from(JobTitle, 'job_titles')
      .execute();

    for (const jobTitle of jobTitles) {
      for (let i = 0; i < Math.floor(Math.random() * 3) + 1; i++) {
        await createQueryBuilder()
          .insert()
          .into(MainDuty)
          .values({
            jobTitleId: jobTitle.id,
            name: faker.company.catchPhraseAdjective(),
            sequence: i + 1,
            occupationTarget: Math.floor(Math.random() * 7) + 1,
          })
          .execute();
      }
    }
  }
}
