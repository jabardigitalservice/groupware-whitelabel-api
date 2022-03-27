import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
}
