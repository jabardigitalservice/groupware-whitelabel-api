import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigModule } from 'src/config/app/config.module';
import { AppConfigService } from 'src/config/app/config.service';
import { AttendancesRepository } from 'src/models/attendances/attendances.repository';
import { AttendancesService } from 'src/models/attendances/attendances.service';
import { ScheduledAttendancesAutoCheckoutService } from './scheduled-auto-checkout.service';

@Module({
  imports: [
    ConfigModule,
    AppConfigModule,
    TypeOrmModule.forFeature([AttendancesRepository]),
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
