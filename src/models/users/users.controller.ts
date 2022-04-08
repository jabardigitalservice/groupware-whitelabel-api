import {
  Body,
  Controller,
  Get,
  HttpStatus,
  InternalServerErrorException,
  Patch,
  Query,
  Res,
  UseGuards,
  Version,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import lang from '../../common/language/configuration';
import { ChangePasswordDto } from './dto/change-password.dto';
import { GetUsersFilterDto } from './dto/get-users-filter.dto';
import { User } from './entities/user.entity';
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

  @Version('1')
  @Patch('/change-password')
  @UseGuards(AuthGuard())
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @GetUser() user: User,
    @Res() response,
  ): Promise<any> {
    const data = await this.usersService.changePassword(
      user,
      changePasswordDto,
    );

    return response.status(HttpStatus.OK).send({
      statusCode: HttpStatus.OK,
      message: lang.__('users.changePassword.success'),
      data,
    });
  }
}
