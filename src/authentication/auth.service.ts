import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '../models/users/entities/user.entity';
import { ResponseJWT, ResponseMe } from './auth.interface';
import { AuthRepository } from './auth.repository';
import { SignInDto } from './dto/sign-in.dto';
import { google, Auth } from 'googleapis';
import { GoogleAuthenticateDto } from './dto/google-authenticate.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { Token } from '../models/users/enums/token.enum';
import { UserTokenRepository } from '../models/users/repositories/user-token.repository';
import { UserToken } from '../models/users/entities/user-token.entity';
import lang from '../common/language/configuration';
import { AppConfigService } from '../config/app/config.service';
import { RequestForgotPasswordDto } from './dto/request-forgot-password.dto';
import { MailService } from 'src/providers/mail/mail.service';
import * as moment from 'moment';
@Injectable()
export class AuthService {
  oauth2Client: Auth.OAuth2Client;

  constructor(
    @InjectRepository(AuthRepository)
    @InjectRepository(UserTokenRepository)
    private authRepository: AuthRepository,
    private userTokenRepository: UserTokenRepository,
    private appConfigService: AppConfigService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {
    this.oauth2Client = new google.auth.OAuth2(
      this.appConfigService.googleClientId,
      this.appConfigService.googleClientSecret,
    );
  }

  async signIn(signInDto: SignInDto): Promise<ResponseJWT> {
    const { email, password } = signInDto;

    const user = await this.authRepository.findByEmail(email);
    if (!user) throw new UnauthorizedException(lang.__('auth.signin.failed'));

    if (Boolean(password)) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        throw new UnauthorizedException(lang.__('auth.signin.failed'));
    }

    if (!user.isActive)
      throw new UnauthorizedException(lang.__('auth.active.failed'));

    if (user.deletedAt)
      throw new UnauthorizedException(lang.__('auth.signin.failed'));

    const responseJwt = await this.generateJwtToken(user.id);
    const decodeRefreshToken = await this.decodeJwtToken(
      responseJwt.refresh_token,
    );

    try {
      const userToken = new UserToken();
      userToken.user = user;
      userToken.token = responseJwt.refresh_token;
      userToken.tokenType = Token.REFRESH;
      userToken.expiredTime = decodeRefreshToken.exp;

      await this.userTokenRepository.save(userToken);
    } catch (error) {
      throw new InternalServerErrorException(
        lang.__('common.error.internalServerError'),
      );
    }

    return responseJwt;
  }

  async googleAuthenticate(
    googleAuthenticateDto: GoogleAuthenticateDto,
  ): Promise<ResponseJWT> {
    const { access_token } = googleAuthenticateDto;
    const userInfo = await this.getUserInfoFromGoogle(access_token);

    if (!userInfo) {
      throw new UnauthorizedException(lang.__('auth.token.not.valid'));
    }

    const user = await this.authRepository.findByEmail(userInfo.email);
    if (!user)
      throw new UnauthorizedException(lang.__('auth.signin.google.not.found'));

    if (!user.isActive)
      throw new UnauthorizedException(lang.__('auth.active.failed'));

    if (user.deletedAt)
      throw new UnauthorizedException(lang.__('auth.signin.google.not.found'));

    const responseJwt = await this.generateJwtToken(user.id);
    const decodeRefreshToken = await this.decodeJwtToken(
      responseJwt.refresh_token,
    );

    try {
      const userToken = new UserToken();
      userToken.user = user;
      userToken.token = responseJwt.refresh_token;
      userToken.tokenType = Token.REFRESH;
      userToken.expiredTime = decodeRefreshToken.exp;

      await this.userTokenRepository.save(userToken);
    } catch (error) {
      throw new InternalServerErrorException(
        lang.__('common.error.internalServerError'),
      );
    }

    return responseJwt;
  }

  async me(user: User): Promise<ResponseMe> {
    const { id, name, email } = user;

    const data = {
      id,
      name,
      email,
    };

    return data;
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto): Promise<ResponseJWT> {
    const { refresh_token } = refreshTokenDto;
    const payload = await this.verifyRefreshToken(refreshTokenDto);

    if (!payload)
      throw new UnauthorizedException(lang.__('auth.refreshToken.failed'));

    const decodeOldRefreshToken = await this.decodeJwtToken(refresh_token);

    const user = await this.authRepository.findById(payload.identifier);
    if (!user)
      throw new UnauthorizedException(lang.__('auth.refreshToken.failed'));

    if (!user.isActive)
      throw new UnauthorizedException(lang.__('auth.refreshToken.failed'));

    if (user.deletedAt)
      throw new UnauthorizedException(lang.__('auth.refreshToken.failed'));

    const responseJwt = await this.generateJwtToken(
      decodeOldRefreshToken.identifier,
    );

    const decodeNewRefreshToken = await this.decodeJwtToken(
      responseJwt.refresh_token,
    );

    try {
      await this.userTokenRepository.updateRefreshToken(refresh_token, {
        refreshToken: responseJwt.refresh_token,
        expiredTime: decodeNewRefreshToken.exp,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        lang.__('common.error.internalServerError'),
      );
    }

    return responseJwt;
  }

  signOut = async (refreshTokenDto: RefreshTokenDto): Promise<void> => {
    const { refresh_token } = refreshTokenDto;
    const userToken = await this.userTokenRepository.findOne({
      token: refresh_token,
      tokenType: Token.REFRESH,
    });

    if (!userToken)
      throw new NotFoundException(lang.__('auth.token.not.valid'));

    await this.userTokenRepository.delete(userToken.id);
  };

  async getUserInfoFromGoogle(access_token: string) {
    try {
      const userInfoClient = google.oauth2('v2').userinfo;

      this.oauth2Client.setCredentials({
        access_token,
      });

      const userInfoResponse = await userInfoClient.get({
        auth: this.oauth2Client,
      });

      if (!userInfoResponse.data) return null;
      return userInfoResponse.data;
    } catch (error) {
      throw new UnauthorizedException(lang.__('auth.token.not.valid'));
    }
  }

  async verifyRefreshToken(refreshToken: RefreshTokenDto): Promise<any> {
    const { refresh_token } = refreshToken;

    try {
      const payload = await this.jwtService.verify(refresh_token, {
        secret: this.appConfigService.jwtRefreshTokenSecret,
        algorithms: this.appConfigService.jwtRefreshTokenAlgorithm,
      });

      const userRefreshToken = await this.userTokenRepository.findOne({
        token: refresh_token,
        tokenType: Token.REFRESH,
      });

      if (!userRefreshToken)
        throw new UnauthorizedException(lang.__('auth.refreshToken.failed'));

      return payload;
    } catch (error) {
      throw new UnauthorizedException(lang.__('auth.refreshToken.failed'));
    }
  }

  async generateJwtToken(identifier: string): Promise<ResponseJWT> {
    const access_token = await this.createAccessToken(identifier);
    const refresh_token = await this.createRefreshToken(identifier);

    const decodeAccessToken = await this.decodeJwtToken(access_token);

    const data = {
      type: this.appConfigService.jwtType,
      access_token,
      refresh_token,
      expires_in: decodeAccessToken.exp,
    };

    return data;
  }

  async createAccessToken(identifier: string): Promise<string> {
    return this.jwtService.sign(
      { identifier },
      {
        expiresIn: this.appConfigService.jwtAccessTokenExpiresIn,
        secret: this.appConfigService.jwtAccessTokenSecret,
        algorithm: this.appConfigService.jwtAccessTokenAlgorithm,
      },
    );
  }

  async createRefreshToken(identifier: string): Promise<string> {
    return this.jwtService.sign(
      { identifier },
      {
        expiresIn: this.appConfigService.jwtRefreshTokenExpiresIn,
        secret: this.appConfigService.jwtRefreshTokenSecret,
        algorithm: this.appConfigService.jwtRefreshTokenAlgorithm,
      },
    );
  }

  async createForgotPasswordToken(identifier: string): Promise<string> {
    return this.jwtService.sign(
      { identifier },
      {
        expiresIn: this.appConfigService.jwtForgotPasswordTokenExpiresIn,
        secret: this.appConfigService.jwtForgotPasswordTokenAlgorithm,
        algorithm: this.appConfigService.jwtRefreshTokenAlgorithm,
      },
    );
  }

  async decodeJwtToken(token: string): Promise<any> {
    try {
      return this.jwtService.decode(token);
    } catch (error) {
      throw new UnauthorizedException(lang.__('auth.token.not.failed'));
    }
  }

  async requestForgotPassword(
    requestForgotPasswordDto: RequestForgotPasswordDto,
  ) {
    const { email } = requestForgotPasswordDto;

    const user = await this.authRepository.findByEmail(email);
    if (!user || user.deletedAt)
      throw new BadRequestException(lang.__('forgotPassword.account.notFound'));

    const forgotPasswordToken = await this.createForgotPasswordToken(user.id);
    const decodeRefreshToken = await this.decodeJwtToken(forgotPasswordToken);
    const expiredTime =
      moment(decodeRefreshToken.exp * 1000).diff(moment(), 'minute') + 1;

    const sendMail = await this.mailService.sendForgotPassword(
      user,
      forgotPasswordToken,
      expiredTime,
    );

    if (!sendMail.accepted.includes(email)) {
      throw new BadRequestException(lang.__('forgotPassword.request.failed'));
    }

    try {
      const userToken = new UserToken();
      userToken.user = user;
      userToken.token = forgotPasswordToken;
      userToken.tokenType = Token.FORGOT_PASSWORD;
      userToken.expiredTime = decodeRefreshToken.exp;

      await this.userTokenRepository.save(userToken);
      return {
        email: user.email,
        expired_time: decodeRefreshToken.exp,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
