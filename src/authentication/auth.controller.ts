import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Res,
  UseGuards,
  Version,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../models/users/entities/user.entity';
import { AuthService } from './auth.service';
import { GoogleAuthenticateDto } from './dto/google-authenticate.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { SignInDto } from './dto/sign-in.dto';
import { GetUser } from '../common/decorators/get-user.decorator';
import lang from '../common/language/configuration';
import { RequestForgotPasswordDto } from './dto/request-forgot-password.dto';
import { VerifyForgotPasswordTokenDto } from './dto/verify-forgot-password-token.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('/auth/users')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Version('1')
  @Post('/sign-in')
  async signIn(@Body() signInDto: SignInDto, @Res() response): Promise<any> {
    const data = await this.authService.signIn(signInDto);

    return response.status(HttpStatus.OK).send({
      statusCode: HttpStatus.OK,
      message: lang.__('auth.signin.success'),
      data,
    });
  }

  @Version('1')
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
      message: lang.__('auth.signin.success'),
      data,
    });
  }

  @Version('1')
  @Get('/me')
  @UseGuards(AuthGuard())
  async me(@GetUser() user: User, @Res() response): Promise<void> {
    const data = await this.authService.me(user);

    return response.status(HttpStatus.OK).send({
      statusCode: HttpStatus.OK,
      message: lang.__('auth.me.success'),
      data,
    });
  }

  @Version('1')
  @Post('/refresh-token')
  async refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
    @Res() response,
  ): Promise<void> {
    const data = await this.authService.refreshToken(refreshTokenDto);

    return response.status(HttpStatus.OK).send({
      statusCode: HttpStatus.OK,
      message: lang.__('auth.refreshToken.success'),
      data,
    });
  }

  @Version('1')
  @Post('/sign-out')
  @UseGuards(AuthGuard())
  async signOut(
    @Body() refreshTokenDto: RefreshTokenDto,
    @Res() response,
  ): Promise<void> {
    const data = await this.authService.signOut(refreshTokenDto);

    return response.status(HttpStatus.OK).send({
      statusCode: HttpStatus.OK,
      message: lang.__('auth.signout.success'),
      data,
    });
  }

  @Version('1')
  @Post('/forgot-password/request')
  async requestForgotPassword(
    @Body() requestForgotPassword: RequestForgotPasswordDto,
    @Res() response,
  ): Promise<void> {
    const data = await this.authService.requestForgotPassword(
      requestForgotPassword,
    );

    return response.status(HttpStatus.OK).send({
      statusCode: HttpStatus.OK,
      message: lang.__('forgotPassword.request.success'),
      data,
    });
  }

  @Version('1')
  @Post('/forgot-password/verify')
  async verifyLinkForgotPassword(
    @Body() verifyForgotPasswordTokenDto: VerifyForgotPasswordTokenDto,
    @Res() response,
  ): Promise<any> {
    const isVerify = await this.authService.verifyLinkForgotPassword(
      verifyForgotPasswordTokenDto,
    );

    return response.status(HttpStatus.OK).send({
      statusCode: HttpStatus.OK,
      message: lang.__('auth.requestForgotPassword.verify.message'),
      data: {
        is_verify: isVerify,
      },
    });
  }

  @Version('1')
  @Post('/reset-password')
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
    @Res() response,
  ): Promise<any> {
    await this.authService.resetPassword(resetPasswordDto);

    return response.status(HttpStatus.OK).send({
      statusCode: HttpStatus.OK,
      message: lang.__('auth.resetPassword.success'),
    });
  }
}
