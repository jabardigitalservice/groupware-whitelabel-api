import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Patch,
  Post,
  Res,
  UseGuards,
  Version,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AttendancesService } from './attendances.service';
import lang from '../../common/language/configuration';
import { CheckInDto } from './dto/check-in.dto';
import { CheckOutDto } from './dto/check-out.dto';
import { User } from '../users/entities/user.entity';
import { GetUserId } from '../../common/decorators/get-user-id.decorator';

@Controller('attendances')
export class AttendancesController {
  constructor(private attendancesService: AttendancesService) {}

  @Version('1')
  @UseGuards(AuthGuard())
  @Post('/check-in')
  async checkIn(
    @GetUserId() user: User,
    @Body() checkInDto: CheckInDto,
    @Res() response,
  ): Promise<any> {
    const data = await this.attendancesService.checkIn(user, checkInDto);

    return response.status(HttpStatus.CREATED).send({
      statusCode: HttpStatus.CREATED,
      message: lang.__('attendances.checkin.success'),
      data,
    });
  }

  @Version('1')
  @UseGuards(AuthGuard())
  @Patch('/check-out')
  async checkOut(
    @GetUserId() user: User,
    @Body() checkOutDto: CheckOutDto,
    @Res() response,
  ): Promise<any> {
    const data = await this.attendancesService.checkOut(user, checkOutDto);

    return response.status(HttpStatus.OK).send({
      statusCode: HttpStatus.OK,
      message: lang.__('attendances.checkout.success'),
      data,
    });
  }

  @Version('1')
  @UseGuards(AuthGuard())
  @Get('/is-checked-in')
  async isCheckedIn(@GetUserId() user: User, @Res() response): Promise<any> {
    const data = await this.attendancesService.isCheckedIn(user);

    return response.status(HttpStatus.OK).send({
      statusCode: HttpStatus.OK,
      message: lang.__('attendances.is.checked.in.success'),
      data,
    });
  }

  @Version('1')
  @UseGuards(AuthGuard())
  @Get('/is-checked-out')
  async isCheckedOut(@GetUserId() user: User, @Res() response): Promise<any> {
    const data = await this.attendancesService.isCheckedOut(user);

    return response.status(HttpStatus.OK).send({
      statusCode: HttpStatus.OK,
      message: lang.__('attendances.is.checked.out.success'),
      data,
    });
  }
}
