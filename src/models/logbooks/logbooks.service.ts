import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MinioProviderService } from '../../providers/storage/minio/minio.service';
import { User } from '../users/entities/user.entity';
import { CreateLogbookDto } from './dto/create-logbook.dto';
import { GetLogbooksFilterDto } from './dto/get-logbook-filter.dto';
import { LogbooksRepository } from './logbooks.repository';

@Injectable()
export class LogbooksService {
  constructor(
    @InjectRepository(LogbooksRepository)
    private logbooksRepository: LogbooksRepository,
    private minioProviderService: MinioProviderService,
  ) {}

  async createLogbook(
    user: User,
    createLogbookDto: CreateLogbookDto,
    evidence_task: Express.Multer.File,
  ): Promise<any> {
    const { partner } = createLogbookDto;

    try {
      const uploaded_file = await this.minioProviderService.upload(
        evidence_task,
      );

      if (partner.length > 0) {
        const logbooks = partner.map((partner) => {
          return this.convertToLogbook(
            createLogbookDto,
            partner,
            uploaded_file,
          );
        });

        logbooks.push(
          this.convertToLogbook(createLogbookDto, user.id, uploaded_file),
        );

        return await this.logbooksRepository.createLogbook(logbooks);
      } else {
        const logbook = this.convertToLogbook(
          createLogbookDto,
          user.id,
          uploaded_file,
        );

        return await this.logbooksRepository.createLogbook(logbook);
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getLogbookByUserId(
    user: User,
    getLogbooksFilterDto: GetLogbooksFilterDto,
  ): Promise<any> {
    try {
      const logbooks = await this.logbooksRepository.getLogbookByUserId(
        user,
        getLogbooksFilterDto,
      );

      return logbooks;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  convertToLogbook(createLogbookDto: CreateLogbookDto, userId, file) {
    return {
      projectId: createLogbookDto.project_id,
      mainDutyId: createLogbookDto.main_duty_id,
      userId: userId,
      nameTask: createLogbookDto.name_task,
      dateTask: createLogbookDto.date_task,
      evidenceTaskPath: file.path,
      linkAttachment: createLogbookDto.link_attachment,
      workplace: createLogbookDto.workplace,
      organizer: createLogbookDto.organizer,
    };
  }
}
