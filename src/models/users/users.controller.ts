import {
  Body,
  Controller,
  Get,
  HttpStatus,
  InternalServerErrorException,
  Patch,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Version,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageFileFilter } from '../../common/helpers/image-file-filter.helper';
import { GetUser } from '../../common/decorators/get-user.decorator';
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

  @Version('1')
  @Patch('/upload-avatar')
  @UseGuards(AuthGuard())
  @UseInterceptors(
    FileInterceptor('avatar', {
      fileFilter: ImageFileFilter,
      limits: {
        fileSize: 1024 * 1024 * 1, // 1MB
      },
    }),
  )
  async uploadAvatar(
    @GetUser() user: User,
    @UploadedFile() avatar: Express.Multer.File,
    @Res() response,
  ): Promise<any> {
    if (!avatar) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: lang.__('common.image.file.invalid'),
      });
    }

    const data = await this.usersService.uploadAvatar(user, avatar);

    return response.status(HttpStatus.OK).send({
      statusCode: HttpStatus.OK,
      message: lang.__('users.upload.avatar.success'),
      data,
    });
  }

  @Version('1')
  @Patch('/delete-avatar')
  @UseGuards(AuthGuard())
  async deleteAvatar(@GetUser() user: User, @Res() response): Promise<any> {
    const data = await this.usersService.deleteAvatar(user);

    return response.status(HttpStatus.OK).send({
      statusCode: HttpStatus.OK,
      message: lang.__('users.delete.avatar.success'),
      data,
    });
  }
}
