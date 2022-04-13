import { EntityRepository, Repository } from 'typeorm';
import { InternalServerErrorException } from '@nestjs/common';
import { Logbook } from './entities/logbooks.entity';

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
}
