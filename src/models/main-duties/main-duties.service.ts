import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@sentry/types';
import { MainDuty } from './entities/main-duties.entity';
import { MainDutiesRepository } from './main-duties.repository';

@Injectable()
export class MainDutiesService {
  constructor(
    @InjectRepository(MainDutiesRepository)
    private mainDutiesRepository: MainDutiesRepository,
  ) {}

  getMainDutyByJobTitleId(user: User): Promise<MainDuty[]> {
    return this.mainDutiesRepository.getMainDutyByJobTitleId(user);
  }
}
