import { define } from 'typeorm-seeding';
import { faker } from '@faker-js/faker';
import { JobTitle } from '../../../models/job-titles/entities/job-titles.entity';

define(JobTitle, () => {
  const jobTitle = new JobTitle();

  jobTitle.name = faker.company.catchPhraseAdjective();
  jobTitle.description = faker.lorem.paragraph();

  return jobTitle;
});
