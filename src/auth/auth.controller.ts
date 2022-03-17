import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/users/entities/user.entity';
import { AuthService } from './auth.service';
import { GoogleAuthenticateDto } from './dto/google-authenticate.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { SignInDto } from './dto/sign-in.dto';
import { GetUser } from './get-user.decorator';

@Controller('v1/auth/users')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/sign-in')
  async signIn(@Body() signInDto: SignInDto, @Res() response): Promise<any> {
    const data = await this.authService.signIn(signInDto);

    return response.status(HttpStatus.OK).send({
      statusCode: HttpStatus.OK,
      message: 'Melakukan sign in berhasil dilakukan',
      data,
    });
  }

  @Post('/google/authenticate')
  async authenticate(
    @Body() googleAuthenticateDto: GoogleAuthenticateDto,
    @Res() response,
  ): Promise<void> {
    const data = await this.authService.googleAuthenticate(
      googleAuthenticateDto,
    );

    return response.status(HttpStatus.OK).send({
      statusCode: HttpStatus.OK,
      message: 'Melakukan sign in berhasil dilakukan',
      data,
    });
  }

  @Get('/me')
  @UseGuards(AuthGuard())
  async me(@GetUser() user: User, @Res() response): Promise<void> {
    const data = await this.authService.me(user);

    return response.status(HttpStatus.OK).send({
      statusCode: HttpStatus.OK,
      message: 'Memuat data diri berhasil dilakukan',
      data,
    });
  }

  @Post('/refresh-token')
  async refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
    @Res() response,
  ): Promise<void> {
    const data = await this.authService.refreshToken(refreshTokenDto);

    return response.status(HttpStatus.OK).send({
      statusCode: HttpStatus.OK,
      message: 'Melakukan pembaruan token berhasil dilakukan',
      data,
    });
  }

  @Post('/sign-out')
  @UseGuards(AuthGuard())
  async signOut(
    @Body() refreshTokenDto: RefreshTokenDto,
    @Res() response,
  ): Promise<void> {
    const data = await this.authService.signOut(refreshTokenDto);

    return response.status(HttpStatus.OK).send({
      statusCode: HttpStatus.OK,
      message: 'Melakukan sign out berhasil dilakukan',
      data,
    });
  }
}
