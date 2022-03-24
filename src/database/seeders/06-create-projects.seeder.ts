import { Projects } from 'src/models/projects/entities/projects.entity';
import { Factory, Seeder } from 'typeorm-seeding';

export default class CreateProjects implements Seeder {
  public async run(factory: Factory): Promise<any> {
    await factory(Projects)().createMany(10);
  }
}
