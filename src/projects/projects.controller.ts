import {
  Controller,
  Get,
  HttpStatus,
  Query,
  Res,
  Version,
} from '@nestjs/common';
import { GetProjectsFilterDto } from './dto/get-projects-filter.dto';
import { ProjectsService } from './projects.service';
import lang from '../language/configuration';

@Controller('projects')
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @Version('1')
  @Get()
  async getProjects(
    @Query() getProjectsFilterDto: GetProjectsFilterDto,
    @Res() response,
  ): Promise<any> {
    const projects = await this.projectsService.getProjects(
      getProjectsFilterDto,
    );

    return response.status(HttpStatus.OK).send({
      statusCode: HttpStatus.OK,
      message: lang.__('projects.getAll.success'),
      data: projects,
    });
  }
}
