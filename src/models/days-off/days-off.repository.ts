import { EntityRepository, Repository } from 'typeorm';
import { DaysOff } from './entities/days-off.entity';

@EntityRepository(DaysOff)
export class DaysOffRepository extends Repository<DaysOff> {}
