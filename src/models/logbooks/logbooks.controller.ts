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
import { GetUserId } from '../../common/decorators/get-user-id.decorator';
import lang from '../../common/language/configuration';
import { User } from '../users/entities/user.entity';
import { CreateLogbookDto } from './dto/create-logbook.dto';
import { LogbooksService } from './logbooks.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageFileFilter } from '../../common/helpers/image-file-filter.helper';

@Controller('logbooks')
export class LogbooksController {
  constructor(private logbooksService: LogbooksService) {}

  @Version('1')
  @UseGuards(AuthGuard())
  @UseInterceptors(
    FileInterceptor('evidence_task', {
      fileFilter: ImageFileFilter,
      limits: {
        fileSize: 1024 * 1024 * 1, // 1MB
      },
    }),
  )
  @Post()
  async createLogbook(
    @GetUserId() user: User,
    @Body() createLogbookDto: CreateLogbookDto,
    @UploadedFile() evidence_task: Express.Multer.File,
    @Res() response,
  ): Promise<any> {
    if (!evidence_task) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: lang.__('common.image.file.invalid'),
      });
    }

    const data = await this.logbooksService.createLogbook(
      user,
      createLogbookDto,
      evidence_task,
    );

    return response.status(HttpStatus.CREATED).send({
      statusCode: HttpStatus.CREATED,
      message: lang.__('logbooks.create.success'),
      data,
    });
  }
}
