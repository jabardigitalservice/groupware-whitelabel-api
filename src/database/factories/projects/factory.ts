import { define } from 'typeorm-seeding';
import { faker } from '@faker-js/faker';
import { Projects } from 'src/models/projects/entities/projects.entity';

define(Projects, () => {
  const project = new Projects();

  project.name = faker.name.jobArea();

  return project;
});
