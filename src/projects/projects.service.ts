import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GetProjectsFilterDto } from './dto/get-projects-filter.dto';
import { Projects } from './projects.entity';
import { ProjectsRepository } from './projects.repository';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(ProjectsRepository)
    private projectsRepository: ProjectsRepository,
  ) {}

  getProjects(getProjectsFilterDto: GetProjectsFilterDto): Promise<Projects[]> {
    return this.projectsRepository.getProjects(getProjectsFilterDto);
  }
}
