import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { AttendancesService } from '../../models/attendances/attendances.service';

@Injectable()
export class ScheduledAttendancesAutoCheckoutService {
  constructor(private attendanceService: AttendancesService) {}

  @Cron('59 59 23 * * *')
  handleCron() {
    this.attendanceService.autoCheckOut();
  }
}
