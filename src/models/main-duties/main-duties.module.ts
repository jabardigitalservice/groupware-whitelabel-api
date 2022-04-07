import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MainDutiesRepository } from './main-duties.repository';
import { MainDutiesService } from './main-duties.service';
import { MainDutiesController } from './main-duties.controller';
import { AuthModule } from '../../authentication/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([MainDutiesRepository]), AuthModule],
  providers: [MainDutiesService],
  controllers: [MainDutiesController],
})
export class MainDutiesModule {}
