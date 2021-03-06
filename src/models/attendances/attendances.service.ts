import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import lang from '../../common/language/configuration';
import { User } from '../users/entities/user.entity';
import { AttendancesRepository } from './attendances.repository';
import { CheckInDto } from './dto/check-in.dto';
import { CheckOutDto } from './dto/check-out.dto';
import { Attendance } from './entities/attendance.entity';
import {
  AttendanceForCalculateOfficeHours,
  ResponseIsCheckedIn,
  ResponseIsCheckedOut,
} from './interfaces/attendance.interface';
import * as moment from 'moment';
import { AppConfigService } from '../../config/app/config.service';
import { PermitsType } from '../days-off/enums/permits-type.enums';
import { DaysOffRepository } from '../days-off/days-off.repository';

@Injectable()
export class AttendancesService {
  constructor(
    private attendancesRepository: AttendancesRepository,
    private daysOffRepository: DaysOffRepository,
    private appConfigService: AppConfigService,
  ) {}

  async checkIn(user: User, checkInDto: CheckInDto): Promise<Attendance> {
    const { date, location, mood, note } = checkInDto;

    const isTodayAttendance = await this.isTodayAttendance(date);
    if (!isTodayAttendance)
      throw new ForbiddenException(lang.__('attendances.not.today'));

    const attendanceToday = await this.isCheckedIn(user);
    if (attendanceToday.isCheckedIn)
      throw new ForbiddenException(
        lang.__('attendances.already.checked.in.for.today'),
      );

    const attendance = new Attendance();

    attendance.startDate = moment(date).toDate();
    attendance.location = location;
    attendance.mood = mood;
    attendance.note = note;
    attendance.user = user;

    try {
      await this.attendancesRepository.save(attendance);
      return attendance;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async checkOut(user: User, checkOutDto: CheckOutDto): Promise<Attendance> {
    const { date } = checkOutDto;
    const currentDate = moment().format('YYYY-MM-DD');
    const currentDateTime = moment().toDate();

    const attendance = await this.attendancesRepository.findByUserAndToday(
      user,
      currentDate,
    );

    if (!attendance)
      throw new NotFoundException(lang.__('attendances.not.found'));

    if (attendance.endDate)
      throw new ForbiddenException(
        lang.__('attendances.already.checked.out.for.today'),
      );

    attendance.endDate = moment(date).toDate();
    attendance.officeHours = await this.calculateOfficeHours(attendance);
    attendance.updatedAt = currentDateTime;

    try {
      await this.attendancesRepository.save(attendance);
      return attendance;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async isTodayAttendance(date: Date): Promise<boolean> {
    const currentDate = moment().format('YYYY-MM-DD');
    return moment(date).format('YYYY-MM-DD') === currentDate;
  }

  async calculateOfficeHours(
    attendance: AttendanceForCalculateOfficeHours,
  ): Promise<number> {
    const { startDate, endDate } = attendance;

    if (!startDate || !endDate) return null;

    const startTime = startDate.getTime();
    const endTime = endDate.getTime();

    if (startTime >= endTime)
      throw new UnprocessableEntityException(
        lang.__('attendances.checkout.end.time.before.start.time.error'),
      );

    // calculate the difference in hours
    const officeHours = (endTime - startTime) / 1000 / 60 / 60;
    return officeHours;
  }

  async isCheckedIn(user: User): Promise<ResponseIsCheckedIn> {
    const currentDate = moment().format('YYYY-MM-DD');
    const isCheckedIn = await this.attendancesRepository.isCheckedIn(
      user,
      currentDate,
    );

    const response: ResponseIsCheckedIn = {
      isCheckedIn: Boolean(isCheckedIn),
    };

    if (isCheckedIn && isCheckedIn.officeHours !== 0) {
      response.date = isCheckedIn.startDate;
      response.isDaysOff = false;
    }

    if (isCheckedIn && isCheckedIn.officeHours === 0) {
      response.isDaysOff = true;
      response.permitsType = PermitsType[isCheckedIn.note];

      const daysOff = await this.daysOffRepository.findByUserAndToday(
        user,
        moment(isCheckedIn.startDate).format('YYYY-MM-DD'),
      );

      if (!daysOff) {
        response.startDate = null;
        response.endDate = null;
      }

      if (daysOff) {
        response.startDate = moment(daysOff.startDate).format('YYYY-MM-DD');
        response.endDate = moment(daysOff.endDate).format('YYYY-MM-DD');
      }
    }

    return response;
  }

  async isCheckedOut(user: User): Promise<ResponseIsCheckedOut> {
    const currentDate = moment().format('YYYY-MM-DD');
    const isCheckedOut = await this.attendancesRepository.isCheckedOut(
      user,
      currentDate,
    );

    const response: ResponseIsCheckedOut = {
      isCheckedOut: Boolean(isCheckedOut),
    };

    return response;
  }

  async autoCheckOut(): Promise<void> {
    const attendances = await this.attendancesRepository.findByNotCheckedOut();

    if (!attendances) return;

    attendances.map(async (attendance) => {
      const startDate = moment(attendance.startDate);
      const currentDateTime = moment().toDate();

      attendance.endDate = startDate
        .add(this.appConfigService.autoCheckOutTime, 'hours')
        .toDate();
      attendance.officeHours = this.appConfigService.autoCheckOutTime;
      attendance.updatedAt = currentDateTime;

      try {
        await this.attendancesRepository.save(attendance);
      } catch (error) {
        throw new InternalServerErrorException(error.message);
      }
    });
  }
}
