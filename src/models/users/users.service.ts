import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import * as moment from 'moment';
import { GetUserInterface } from '../../common/interfaces/get-user.interface';
import lang from '../../common/language/configuration';
import { ChangePasswordDto } from './dto/change-password.dto';
import { GetUsersFilterDto } from './dto/get-users-filter.dto';
import { User } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  getUsers(getUsersFilterDto: GetUsersFilterDto): Promise<User[]> {
    return this.userRepository.getUsers(getUsersFilterDto);
  }

  getUserById(id: string): Promise<User> {
    return this.userRepository.getUserById(id);
  }

  async changePassword(
    user: GetUserInterface,
    changePasswordDto: ChangePasswordDto,
  ): Promise<any> {
    const { password } = user;
    const { currentPassword, newPassword } = changePasswordDto;
    const currentDateTime = moment().toDate();

    const isMatch = await bcrypt.compare(currentPassword, password);
    if (!isMatch)
      throw new BadRequestException(
        lang.__('users.changePassword.currentPassword.invalid'),
      );

    const isSame = await bcrypt.compare(newPassword, password);
    if (isSame)
      throw new BadRequestException(
        lang.__('users.changePassword.newPassword.invalid'),
      );

    try {
      user.password = await bcrypt.hash(newPassword, 10);
      user.updatedAt = currentDateTime;
      await this.userRepository.save(user);
    } catch (error) {
      throw new InternalServerErrorException(
        lang.__('common.error.internalServerError'),
      );
    }
  }
}
