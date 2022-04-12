import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Version,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DaysOffService } from './days-off.service';
import lang from '../../common/language/configuration';
import { User } from '../users/entities/user.entity';
import { GetUserId } from '../../common/decorators/get-user-id.decorator';
import { CreateDaysOffDto } from './dto/create-days-off.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageFileFilter } from '../../common/helpers/image-file-filter.helper';

@Controller('attendances')
export class DaysOffController {
  constructor(private daysOffService: DaysOffService) {}

  @Version('1')
  @UseGuards(AuthGuard())
  @UseInterceptors(
    FileInterceptor('image', {
      fileFilter: ImageFileFilter,
      limits: {
        fileSize: 1024 * 1024 * 1, // 1MB
      },
    }),
  )
  @Post('/days-off')
  async daysOff(
    @GetUserId() user: User,
    @Body() createDaysOffDto: CreateDaysOffDto,
    @UploadedFile() image: Express.Multer.File,
    @Res() response,
  ): Promise<any> {
    if (!image) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: lang.__('common.image.file.invalid'),
      });
    }

    const data = await this.daysOffService.createDaysOff(
      user,
      createDaysOffDto,
      image,
    );

    return response.status(HttpStatus.CREATED).send({
      statusCode: HttpStatus.CREATED,
      message: lang.__('attendances.checkin.success'),
      data,
    });
  }
}
