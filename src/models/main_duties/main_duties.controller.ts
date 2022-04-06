import {
  Controller,
  Get,
  HttpStatus,
  InternalServerErrorException,
  Res,
  UseGuards,
  Version,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUserJobTitleId } from '../../common/decorators/get-user-job-title-id.decorator';
import lang from '../../common/language/configuration';
import { User } from '../users/entities/user.entity';
import { MainDutiesService } from './main_duties.service';

@Controller('main-duties')
export class MainDutiesController {
  constructor(private mainDutiesService: MainDutiesService) {}

  @Version('1')
  @Get('/mine')
  @UseGuards(AuthGuard())
  async getMainDutyByJobTitle(
    @GetUserJobTitleId() user: User,
    @Res() response,
  ): Promise<any> {
    try {
      const mainDuties = await this.mainDutiesService.getMainDutyByJobTitleId(
        user,
      );

      return response.status(HttpStatus.OK).send({
        statusCode: HttpStatus.OK,
        message: lang.__('mainDuties.getMainDutyByJobTitleId.success'),
        data: mainDuties,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
