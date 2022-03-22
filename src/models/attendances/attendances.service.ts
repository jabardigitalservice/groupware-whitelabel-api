import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { currentDate, currentDateTime } from '../../common/helpers/date.helper';
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

@Injectable()
export class AttendancesService {
  constructor(
    @InjectRepository(AttendancesRepository)
    private attendancesRepository: AttendancesRepository,
  ) {}

  async checkIn(user: User, checkInDto: CheckInDto): Promise<Attendance> {
    const attendanceToday = await this.isCheckedIn(user);

    if (attendanceToday.isCheckedIn)
      throw new ForbiddenException(
        lang.__('attendances.already.checked.in.for.today'),
      );

    const { date, location, mood, note } = checkInDto;
    const attendance = new Attendance();

    attendance.startDate = new Date(date);
    attendance.location = location;
    attendance.mood = mood;
    attendance.note = note;
    attendance.user = user;

    await this.attendancesRepository.save(attendance);
    return attendance;
  }

  async checkOut(user: User, checkOutDto: CheckOutDto): Promise<Attendance> {
    const { date } = checkOutDto;

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

    attendance.endDate = new Date(date);
    attendance.officeHours = await this.calculateOfficeHours(attendance);
    attendance.updatedAt = new Date(currentDateTime);

    await this.attendancesRepository.save(attendance);
    return attendance;
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
