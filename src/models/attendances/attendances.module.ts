import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigModule } from '../../config/app/config.module';
import { AuthModule } from '../../authentication/auth.module';
import { AttendancesController } from './attendances.controller';
import { AttendancesRepository } from './attendances.repository';
import { AttendancesService } from './attendances.service';
import { DaysOffRepository } from '../days-off/days-off.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([AttendancesRepository, DaysOffRepository]),
    AuthModule,
    AppConfigModule,
  ],
  controllers: [AttendancesController],
  providers: [AttendancesService],
})
export class AttendancesModule {}
