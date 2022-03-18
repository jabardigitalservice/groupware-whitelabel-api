import { Project } from 'src/projects/projects.entity';
import { Factory, Seeder } from 'typeorm-seeding';

export default class CreateProjects implements Seeder {
  public async run(factory: Factory): Promise<any> {
    await factory(Project)().createMany(10);
  }
}
