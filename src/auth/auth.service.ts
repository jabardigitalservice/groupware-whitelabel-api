import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { ResponseJWT, ResponseMe } from './auth.interface';
import { AuthRepository } from './auth.repository';
import { SignInDto } from './dto/sign-in.dto';
import { google, Auth } from 'googleapis';
import { GoogleAuthenticateDto } from './dto/google-authenticate.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { UserTokenRepository } from '../users/repositories/user-token.repository';
import { UserToken } from 'src/users/entities/user-token.entity';

@Injectable()
export class AuthService {
  oauth2Client: Auth.OAuth2Client;

  constructor(
    @InjectRepository(AuthRepository)
    @InjectRepository(UserTokenRepository)
    private authRepository: AuthRepository,
    private userTokenRepository: UserTokenRepository,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {
    this.oauth2Client = new google.auth.OAuth2(
      this.configService.get('GOOGLE_CLIENT_ID'),
      this.configService.get('GOOGLE_CLIENT_SECRET'),
    );
  }

  async signIn(signInDto: SignInDto): Promise<ResponseJWT> {
    const { email, password } = signInDto;

    const user = await this.authRepository.findByEmail(email);
    if (!user)
      throw new UnauthorizedException('Email dan Kata Sandi tidak ditemukan');

    if (Boolean(password)) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        throw new UnauthorizedException('Email dan Kata Sandi tidak ditemukan');
    }

    if (!user.isActive) throw new UnauthorizedException('Akun tidak aktif');

    if (user.deletedAt)
      throw new UnauthorizedException('Email dan Kata Sandi tidak ditemukan');

    const responseJwt = await this.generateJwtToken(user.id);
    const decodeRefreshToken = await this.decodeJwtToken(
      responseJwt.refresh_token,
    );

    try {
      const userToken = new UserToken();
      userToken.user = user;
      userToken.refreshToken = responseJwt.refresh_token;
      userToken.expiredTime = decodeRefreshToken.exp;

      await this.userTokenRepository.save(userToken);
    } catch (error) {
      throw new InternalServerErrorException('Terdapat kesalahan di server');
    }

    return responseJwt;
  }

  async googleAuthenticate(
    googleAuthenticateDto: GoogleAuthenticateDto,
  ): Promise<ResponseJWT> {
    const { access_token } = googleAuthenticateDto;
    const userInfo = await this.getUserInfoFromGoogle(access_token);

    if (!userInfo) {
      throw new UnauthorizedException(
        'Login dengan Google gagal, silahkan coba lagi',
      );
    }

    const user = await this.authRepository.findByEmail(userInfo.email);
    if (!user) throw new UnauthorizedException('Akun tidak ditemukan');

    if (!user.isActive) throw new UnauthorizedException('Akun tidak aktif');

    if (user.deletedAt) throw new UnauthorizedException('Akun tidak ditemukan');

    const responseJwt = await this.generateJwtToken(user.id);
    const decodeRefreshToken = await this.decodeJwtToken(
      responseJwt.refresh_token,
    );

    try {
      const userToken = new UserToken();
      userToken.user = user;
      userToken.refreshToken = responseJwt.refresh_token;
      userToken.expiredTime = decodeRefreshToken.exp;

      await this.userTokenRepository.save(userToken);
    } catch (error) {
      throw new InternalServerErrorException('Terdapat kesalahan di server');
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
      throw new UnauthorizedException(
        'Melakukan pembaruan token gagal dilakukan',
      );

    const decodeOldRefreshToken = await this.decodeJwtToken(refresh_token);

    const user = await this.authRepository.findOne(payload.identifier);
    if (!user)
      throw new UnauthorizedException(
        'Melakukan pembaruan token gagal dilakukan',
      );

    if (!user.isActive)
      throw new UnauthorizedException(
        'Melakukan pembaruan token gagal dilakukan',
      );

    if (user.deletedAt)
      throw new UnauthorizedException(
        'Melakukan pembaruan token gagal dilakukan',
      );

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
      throw new InternalServerErrorException('Terdapat kesalahan di server');
    }

    return responseJwt;
  }

  signOut = async (refreshTokenDto: RefreshTokenDto): Promise<void> => {
    const { refresh_token } = refreshTokenDto;
    const userToken = await this.userTokenRepository.findOne({
      refreshToken: refresh_token,
    });

    if (!userToken)
      throw new NotFoundException('Refresh Token tidak ditemukan');

    this.userTokenRepository.delete(userToken);
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
      throw new UnauthorizedException(
        'Login dengan Google gagal, silahkan coba lagi',
      );
    }
  }

  async verifyRefreshToken(refreshToken: RefreshTokenDto): Promise<any> {
    const { refresh_token } = refreshToken;

    try {
      const payload = await this.jwtService.verify(refresh_token, {
        secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
        algorithms: this.configService.get('JWT_REFRESH_TOKEN_ALGORITHM'),
      });

      const userRefreshToken = await this.userTokenRepository.findOne({
        refreshToken: refresh_token,
      });

      if (!userRefreshToken)
        throw new UnauthorizedException('Refresh Token tidak valid');

      return payload;
    } catch (error) {
      throw new UnauthorizedException('Refresh token tidak valid');
    }
  }

  async generateJwtToken(identifier: string): Promise<ResponseJWT> {
    const access_token = await this.createAccessToken(identifier);
    const refresh_token = await this.createRefreshToken(identifier);

    const decodeAccessToken = await this.decodeJwtToken(access_token);

    const data = {
      type: this.configService.get('JWT_TYPE'),
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
        expiresIn: this.configService.get('JWT_ACCESS_TOKEN_EXPIRES_IN'),
        secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
        algorithm: this.configService.get('JWT_ACCESS_TOKEN_ALGORITHM'),
      },
    );
  }

  async createRefreshToken(identifier: string): Promise<string> {
    return this.jwtService.sign(
      { identifier },
      {
        expiresIn: this.configService.get('JWT_REFRESH_TOKEN_EXPIRES_IN'),
        secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
        algorithm: this.configService.get('JWT_REFRESH_TOKEN_ALGORITHM'),
      },
    );
  }

  async decodeJwtToken(token: string): Promise<any> {
    try {
      return this.jwtService.decode(token);
    } catch (error) {
      throw new UnauthorizedException('Token tidak valid');
    }
  }
}
