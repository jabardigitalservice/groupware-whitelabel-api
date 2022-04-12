import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { MinioProviderService } from '../../providers/storage/minio/minio.service';
import { User } from '../users/entities/user.entity';
import { DaysOffRepository } from './days-off.repository';
import { CreateDaysOffDto } from './dto/create-days-off.dto';
import { DaysOff } from './entities/days-off.entity';
import lang from '../../common/language/configuration';
import { PermitsType } from './enums/permits-type.enums';
import { Attendance } from '../attendances/entities/attendance.entity';
import { AttendancesRepository } from '../attendances/attendances.repository';
import * as moment from 'moment';
import { Connection } from 'typeorm';

@Injectable()
export class DaysOffService {
  constructor(
    private connection: Connection,
    private minioProviderService: MinioProviderService,
    private daysOffRepository: DaysOffRepository,
    private attendancesRepository: AttendancesRepository,
  ) {}

  async createDaysOff(
    user: User,
    createDaysOffDto: CreateDaysOffDto,
    image: Express.Multer.File,
  ): Promise<any> {
    const { start_date, end_date, permits_type, note } = createDaysOffDto;

    let permitAcknowledged: any = createDaysOffDto.permit_acknowledged;
    permitAcknowledged = permitAcknowledged.split(',');

    const isAttendanceExist = await this.isAttendanceExist(
      user,
      start_date,
      end_date,
    );

    if (isAttendanceExist)
      throw new BadRequestException(lang.__('daysoff.is.exist'));

    await this.createAttendanceDaysOff(
      user,
      start_date,
      end_date,
      permits_type,
    );

    try {
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

  async createAttendanceDaysOff(
    user: User,
    startDate: Date,
    endDate: Date,
    permitsType: PermitsType,
  ): Promise<any> {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (
        const date = moment(startDate);
        date.isSameOrBefore(endDate);
        date.add(1, 'days')
      ) {
        // Skip if day is weekend
        if (date.day() === 0 || date.day() === 6) continue;

        const attendance = new Attendance();

        attendance.startDate = moment(date).toDate();
        attendance.endDate = moment(date).toDate();
        attendance.officeHours = 0;
        attendance.location = '-';
        attendance.note = permitsType;
        attendance.user = user;

        await queryRunner.manager.save(attendance);
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async isAttendanceExist(
    user: User,
    startDate: Date,
    endDate: Date,
  ): Promise<Boolean> {
    const attendance = await this.attendancesRepository.isAttendanceExist(
      user,
      startDate,
      endDate,
    );

    if (attendance) return true;
    return false;
  }
}
