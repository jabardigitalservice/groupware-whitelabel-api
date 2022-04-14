import { EntityRepository, Repository } from 'typeorm';
import { InternalServerErrorException } from '@nestjs/common';
import { Logbook } from './entities/logbooks.entity';
import { GetLogbooksFilterDto } from './dto/get-logbook-filter.dto';
import { User } from '@sentry/types';
import * as moment from 'moment';

@EntityRepository(Logbook)
export class LogbooksRepository extends Repository<Logbook> {
  async createLogbook(newLogbook): Promise<any> {
    try {
      const logbook = this.create(newLogbook);
      await this.save(logbook);

      return logbook;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getLogbookByUserId(
    user: User,
    getLogbooksFilterDto: GetLogbooksFilterDto,
  ): Promise<any> {
    try {
      const {
        startDate = moment().format('YYYY-MM-DD 00:00:00'),
        endDate = moment().format('YYYY-MM-DD 23:59:59'),
        page = 1,
        limit = 10,
      } = getLogbooksFilterDto;

      const skip = (page - 1) * limit;
      const userId = user.id;

      const queryLogbooks = this.createQueryBuilder('logbook');
      queryLogbooks.where('logbook.userId = :userId', { userId });
      queryLogbooks.andWhere('logbook.deletedAt IS NULL');
      queryLogbooks.andWhere(
        '(logbook.dateTask BETWEEN :startDate AND :endDate)',
        {
          startDate,
          endDate,
        },
      );

      const count: number = await queryLogbooks.getCount();

      queryLogbooks.take(limit);
      queryLogbooks.skip(skip);
      const logbooks = await queryLogbooks.getRawMany();

      return {
        logbooks,
        meta: {
          total: count,
          page: +page,
          lastPage: Math.ceil(count / limit),
          firstPage: 1,
        },
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
