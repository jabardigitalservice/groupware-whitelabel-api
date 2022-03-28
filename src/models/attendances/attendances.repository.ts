import { User } from '../users/entities/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { Attendance } from './entities/attendance.entity';
import { InternalServerErrorException } from '@nestjs/common';

@EntityRepository(Attendance)
export class AttendancesRepository extends Repository<Attendance> {
  async findByNotCheckedOut(): Promise<Attendance[]> {
    try {
      const attendances = await this.createQueryBuilder('attendances')
        .andWhere('attendances.end_date IS NULL')
        .getMany();

      return attendances;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findByUserAndToday(user: User, today: string): Promise<Attendance> {
    try {
      const attendance = await this.createQueryBuilder('attendances')
        .where('attendances.user_id = :user_id', { user_id: user.id })
        .andWhere('DATE(attendances.start_date) = :today', { today })
        .orderBy('attendances.start_date', 'ASC')
        .getOne();

      return attendance;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async isCheckedIn(user: User, today: string): Promise<Attendance> {
    try {
      const isCheckedIn = await this.createQueryBuilder('attendances')
        .where('attendances.user_id = :user_id', { user_id: user.id })
        .andWhere('DATE(attendances.start_date) = :today', { today })
        .orderBy('attendances.start_date', 'ASC')
        .getOne();

      return isCheckedIn;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async isCheckedOut(user: User, today: string): Promise<Attendance> {
    try {
      const isCheckedOut = await this.createQueryBuilder('attendances')
        .where('attendances.user_id = :user_id', { user_id: user.id })
        .andWhere('DATE(attendances.start_date) = :today', { today })
        .andWhere('attendances.end_date IS NOT NULL')
        .orderBy('attendances.start_date', 'ASC')
        .getOne();

      return isCheckedOut;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
