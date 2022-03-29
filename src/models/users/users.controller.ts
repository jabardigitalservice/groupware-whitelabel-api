import {
  BadRequestException,
  Controller,
  Get,
  HttpStatus,
  InternalServerErrorException,
  Query,
  Res,
  Version,
} from '@nestjs/common';
import lang from '../../common/language/configuration';
import { GetUsersFilterDto } from './dto/get-users-filter.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Version('1')
  @Get()
  async getUsers(
    @Query() getUsersFilterDto: GetUsersFilterDto,
    @Res() response,
  ): Promise<any> {
    try {
      const users = await this.usersService.getUsers(getUsersFilterDto);

      return response.status(HttpStatus.OK).send({
        statusCode: HttpStatus.OK,
        message: lang.__('users.getAll.success'),
        data: users,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
