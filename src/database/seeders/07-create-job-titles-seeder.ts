import { JobTitle } from '../../models/job-titles/entities/job-titles.entity';
import { Factory, Seeder } from 'typeorm-seeding';

export default class CreateJobTitles implements Seeder {
  public async run(factory: Factory): Promise<any> {
    await factory(JobTitle)().createMany(10);
  }
}
