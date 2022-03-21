import { EntityRepository, Repository } from 'typeorm';
import { GetProjectsFilterDto } from './dto/get-projects-filter.dto';
import { Projects } from './projects.entity';

@EntityRepository(Projects)
export class ProjectsRepository extends Repository<Projects> {
  getProjects(getProjectsFilterDto: GetProjectsFilterDto): Promise<Projects[]> {
    const { name } = getProjectsFilterDto;

    const query = this.createQueryBuilder('project')
      .select(['project.id', 'project.name', 'project.description'])
      .where('project.deleted_at is null')
      .orderBy('project.created_at', 'ASC');

    if (name) {
      query.andWhere('LOWER(project.name) LIKE LOWER(:name)', {
        name: `%${name}%`,
      });
    }

    return query.getMany();
  }
}
