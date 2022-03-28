import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../../authentication/auth.module';
import { AttendancesController } from './attendances.controller';
import { AttendancesRepository } from './attendances.repository';
import { AttendancesService } from './attendances.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([AttendancesRepository]),
    AuthModule,
    ConfigModule,
  ],
  controllers: [AttendancesController],
  providers: [AttendancesService],
})
export class AttendancesModule {}
