import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get env(): string {
    return this.configService.get('app.APP_ENV');
  }
  get name(): string {
    return this.configService.get('app.APP_NAME');
  }
  get url(): string {
    return this.configService.get('app.APP_URL');
  }
  get port(): number {
    return Number(this.configService.get('app.APP_PORT'));
  }
  get language(): string {
    return this.configService.get('app.APP_LANGUAGE');
  }

  get autoCheckOutTime(): number {
    return this.configService.get('app.AUTO_CHECK_OUT_TIME');
  }

  get jwtAccessTokenSecret(): string {
    return this.configService.get('app.JWT_ACCESS_TOKEN_SECRET');
  }
  get jwtAccessTokenAlgorithm(): any {
    return this.configService.get('app.JWT_ACCESS_TOKEN_ALGORITHM');
  }
  get jwtAccessTokenExpiresIn(): string {
    return this.configService.get('app.JWT_ACCESS_TOKEN_EXPIRES_IN');
  }

  get jwtType(): string {
    return this.configService.get('app.JWT_TYPE');
  }

  get jwtRefreshTokenSecret(): string {
    return this.configService.get('app.JWT_REFRESH_TOKEN_SECRET');
  }
  get jwtRefreshTokenAlgorithm(): any {
    return this.configService.get('app.JWT_REFRESH_TOKEN_ALGORITHM');
  }
  get jwtRefreshTokenExpiresIn(): string {
    return this.configService.get('app.JWT_REFRESH_TOKEN_EXPIRES_IN');
  }

  get googleClientId(): string {
    return this.configService.get('app.GOOGLE_CLIENT_ID');
  }
  get googleClientSecret(): string {
    return this.configService.get('app.GOOGLE_CLIENT_SECRET');
  }
  get googleScope(): string {
    const scope = this.configService.get('app.GOOGLE_SCOPE');
    return scope.split(',');
  }
  get googleUserProfileUrl(): string {
    return this.configService.get('app.GOOGLE_USER_PROFILE_URL');
  }

  get defaultAdminName(): string {
    return this.configService.get('app.DEFAULT_ADMIN_NAME');
  }
  get defaultAdminEmail(): string {
    return this.configService.get('app.DEFAULT_ADMIN_EMAIL');
  }
  get defaultPassword(): string {
    return this.configService.get('app.DEFAULT_PASSWORD');
  }

  get mailHost(): string {
    return this.configService.get('app.MAIL_HOST');
  }
  get mailUser(): string {
    return this.configService.get('app.MAIL_USER');
  }
  get mailPassword(): string {
    return this.configService.get('app.MAIL_PASSWORD');
  }
  get mailFrom(): string {
    return this.configService.get('app.MAIL_FROM');
  }

  get forgotPasswordUrl(): string {
    return this.configService.get('app.FORGOT_PASSWORD_URL');
  }
}
