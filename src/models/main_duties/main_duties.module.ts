import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MainDutiesRepository } from './main_duties.repository';
import { MainDutiesService } from './main_duties.service';
import { MainDutiesController } from './main_duties.controller';
import { AuthModule } from '../../authentication/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([MainDutiesRepository]), AuthModule],
  providers: [MainDutiesService],
  controllers: [MainDutiesController],
})
export class MainDutiesModule {}
