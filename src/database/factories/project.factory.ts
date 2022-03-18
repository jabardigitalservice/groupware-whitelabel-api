import { define } from 'typeorm-seeding';
import { faker } from '@faker-js/faker';
import { Project } from 'src/projects/projects.entity';

define(Project, () => {
  const project = new Project();

  project.name = faker.name.jobArea();

  return project;
});
