import { InternalServerErrorException } from '@nestjs/common';
import { User } from '@sentry/types';
import { EntityRepository, Repository } from 'typeorm';
import { MainDuty } from './entities/main_duties.entity';

@EntityRepository(MainDuty)
export class MainDutiesRepository extends Repository<MainDuty> {
  async getMainDutyByJobTitleId(user: User): Promise<MainDuty[]> {
    try {
      const query = this.createQueryBuilder('main_duties')
        .select(['main_duties.id', 'main_duties.name', 'main_duties.sequence'])
        .where('main_duties.job_title_id = :user', { user })
        .orderBy('main_duties.sequence', 'ASC');

      return await query.getMany();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
