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
  ): Promise<Logbook[]> {
    try {
      const {
        startDate = moment().format('YYYY-MM-DD 00:00:00'),
        endDate = moment().format('YYYY-MM-DD 23:59:59'),
        page = 1,
        limit = 10,
      } = getLogbooksFilterDto;

      const skip = (page - 1) * limit;
      const userId = user.id;

      const logbook = this.createQueryBuilder('logbook');
      logbook.where('logbook.userId = :userId', { userId });
      logbook.andWhere('logbook.deletedAt IS NULL');
      logbook.andWhere('(logbook.dateTask BETWEEN :startDate AND :endDate)', {
        startDate,
        endDate,
      });
      logbook.take(limit);
      logbook.skip(skip);

      return await logbook.getRawMany();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
