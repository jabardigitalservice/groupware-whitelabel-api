import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import lang from '../../language/configuration';
import { User } from '../../users/entities/user.entity';
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

@Injectable()
export class AttendancesService {
  constructor(
    @InjectRepository(AttendancesRepository)
    private attendancesRepository: AttendancesRepository,
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

    attendance.startDate = moment.utc(date).toDate();
    attendance.location = location;
    attendance.mood = mood;
    attendance.note = note;
    attendance.user = user;

    await this.attendancesRepository.save(attendance);
    return attendance;
  }

  async checkOut(user: User, checkOutDto: CheckOutDto): Promise<Attendance> {
    const { date } = checkOutDto;
    const currentDate = moment.utc().format('YYYY-MM-DD');
    const currentDateTime = moment.utc().toDate();

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

    attendance.endDate = moment.utc(date).toDate();
    attendance.officeHours = await this.calculateOfficeHours(attendance);
    attendance.updatedAt = currentDateTime;

    await this.attendancesRepository.save(attendance);
    return attendance;
  }

  async isTodayAttendance(date: Date): Promise<boolean> {
    const currentDate = moment.utc().format('YYYY-MM-DD');
    return moment.utc(date).format('YYYY-MM-DD') === currentDate;
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
    const currentDate = moment.utc().format('YYYY-MM-DD');
    const isCheckedIn = await this.attendancesRepository.isCheckedIn(
      user,
      currentDate,
    );

    const response: ResponseIsCheckedIn = {
      isCheckedIn: Boolean(isCheckedIn),
    };

    if (isCheckedIn) response.date = isCheckedIn.startDate;
    return response;
  }

  async isCheckedOut(user: User): Promise<ResponseIsCheckedOut> {
    const currentDate = moment.utc().format('YYYY-MM-DD');
    const isCheckedOut = await this.attendancesRepository.isCheckedOut(
      user,
      currentDate,
    );

    const response: ResponseIsCheckedOut = {
      isCheckedOut: Boolean(isCheckedOut),
    };

    return response;
  }
}
