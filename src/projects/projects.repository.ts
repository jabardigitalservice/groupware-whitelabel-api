import { EntityRepository, Repository } from 'typeorm';
import { GetProjectsFilterDto } from './dto/get-projects-filter.dto';
import { Project } from './projects.entity';

@EntityRepository(Project)
export class ProjectsRepository extends Repository<Project> {
  getProjects(getProjectsFilterDto: GetProjectsFilterDto): Promise<Project[]> {
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
