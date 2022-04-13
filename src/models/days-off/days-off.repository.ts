import { InternalServerErrorException } from '@nestjs/common';
import { User } from '@sentry/node';
import { EntityRepository, Repository } from 'typeorm';
import { DaysOff } from './entities/days-off.entity';

@EntityRepository(DaysOff)
export class DaysOffRepository extends Repository<DaysOff> {
  async findByUserAndToday(user: User, today: string): Promise<DaysOff> {
    try {
      const daysOff = await this.createQueryBuilder('days_off')
        .where('days_off.user_id = :user_id', { user_id: user.id })
        .andWhere(':today BETWEEN days_off.start_date AND days_off.end_date', {
          today,
        })
        .getOne();

      return daysOff;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
