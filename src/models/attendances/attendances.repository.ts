import { User } from '../../users/entities/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { Attendance } from './entities/attendance.entity';

@EntityRepository(Attendance)
export class AttendancesRepository extends Repository<Attendance> {
  async findByUserAndToday(user: User, today: string): Promise<Attendance> {
    const attendance = await this.createQueryBuilder('attendances')
      .where('attendances.user_id = :user_id', { user_id: user.id })
      .andWhere('DATE(attendances.start_date) = :today', { today })
      .orderBy('attendances.start_date', 'ASC')
      .getOne();

    return attendance;
  }

  async isCheckedIn(user: User, today: string): Promise<Attendance> {
    const isCheckedIn = await this.createQueryBuilder('attendances')
      .where('attendances.user_id = :user_id', { user_id: user.id })
      .andWhere('DATE(attendances.start_date) = :today', { today })
      .orderBy('attendances.start_date', 'ASC')
      .getOne();

    return isCheckedIn;
  }

  async isCheckedOut(user: User, today: string): Promise<Attendance> {
    const isCheckedOut = await this.createQueryBuilder('attendances')
      .where('attendances.user_id = :user_id', { user_id: user.id })
      .andWhere('DATE(attendances.start_date) = :today', { today })
      .andWhere('attendances.end_date IS NOT NULL')
      .orderBy('attendances.start_date', 'ASC')
      .getOne();

    return isCheckedOut;
  }
}
