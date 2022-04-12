import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { MinioProviderService } from '../../providers/storage/minio/minio.service';
import { User } from '../users/entities/user.entity';
import { DaysOffRepository } from './days-off.repository';
import { CreateDaysOffDto } from './dto/create-days-off.dto';
import { DaysOff } from './entities/days-off.entity';

@Injectable()
export class DaysOffService {
  constructor(
    private minioProviderService: MinioProviderService,
    private daysOffRepository: DaysOffRepository,
  ) {}

  async createDaysOff(
    user: User,
    createDaysOffDto: CreateDaysOffDto,
    image: Express.Multer.File,
  ): Promise<any> {
    try {
      const { start_date, end_date, permits_type, note } = createDaysOffDto;

      let permitAcknowledged: any = createDaysOffDto.permit_acknowledged;
      permitAcknowledged = permitAcknowledged.split(',');

      const uploaded_image = await this.minioProviderService.upload(image);

      const daysOff = new DaysOff();
      daysOff.startDate = start_date;
      daysOff.endDate = end_date;
      daysOff.permitsType = permits_type;
      daysOff.permitAcknowledged = permitAcknowledged;
      daysOff.note = note;
      daysOff.filePath = uploaded_image.path;
      daysOff.fileUrl = uploaded_image.url;
      daysOff.user = user;
      await this.daysOffRepository.save(daysOff);

      return daysOff;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
