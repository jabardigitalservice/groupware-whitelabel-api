import { Controller, Get, HttpStatus, Query, Res } from '@nestjs/common';
import { GetProjectsFilterDto } from './dto/get-projects-filter.dto';
import { ProjectsService } from './projects.service';

@Controller('projects')
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

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
      message: 'Berhasil mendapatkan list project',
      data: projects,
    });
  }
}
