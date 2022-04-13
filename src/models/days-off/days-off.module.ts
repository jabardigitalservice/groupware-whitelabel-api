import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../../authentication/auth.module';
import { MinioProviderModule } from '../../providers/storage/minio/minio.module';
import { AttendancesRepository } from '../attendances/attendances.repository';
import { DaysOffController } from './days-off.controller';
import { DaysOffRepository } from './days-off.repository';
import { DaysOffService } from './days-off.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([DaysOffRepository, AttendancesRepository]),
    AuthModule,
    MinioProviderModule,
  ],
  controllers: [DaysOffController],
  providers: [DaysOffService],
})
export class DaysOffModule {}
