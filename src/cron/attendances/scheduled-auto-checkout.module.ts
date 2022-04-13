import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigModule } from '../../config/app/config.module';
import { AppConfigService } from '../../config/app/config.service';
import { AttendancesRepository } from '../../models/attendances/attendances.repository';
import { DaysOffRepository } from '../../models/days-off/days-off.repository';
import { AttendancesService } from '../../models/attendances/attendances.service';
import { ScheduledAttendancesAutoCheckoutService } from './scheduled-auto-checkout.service';

@Module({
  imports: [
    ConfigModule,
    AppConfigModule,
    TypeOrmModule.forFeature([AttendancesRepository, DaysOffRepository]),
    ScheduleModule.forRoot(),
  ],
  providers: [
    AppConfigService,
    AttendancesService,
    ScheduledAttendancesAutoCheckoutService,
  ],
  exports: [ScheduledAttendancesAutoCheckoutService],
})
export class ScheduledAttendancesAutoCheckoutModule {}
