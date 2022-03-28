import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigModule } from '../../config/app/config.module';
import { AppConfigService } from '../../config/app/config.service';
import { AuthModule } from '../../authentication/auth.module';
import { AttendancesController } from './attendances.controller';
import { AttendancesRepository } from './attendances.repository';
import { AttendancesService } from './attendances.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([AttendancesRepository]),
    AuthModule,
    ConfigModule,
    AppConfigModule,
  ],
  controllers: [AttendancesController],
  providers: [AttendancesService, AppConfigService],
})
export class AttendancesModule {}
