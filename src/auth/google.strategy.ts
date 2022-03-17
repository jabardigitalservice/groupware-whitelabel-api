import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(configService: ConfigService) {
    super({
      clientID: configService.get('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get('GOOGLE_CALLBACK_URL'),
      scope: ['profile', 'email'],
      userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo',
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    callback: VerifyCallback,
  ): Promise<any> {
    const { name, emails, photos } = profile;

    const user = {
      emails: emails[0].value,
      name: name.givenName.concat(' ', name.familyName),
      photo: photos[0].value,
      accessToken,
    };

    return callback(null, user);
  }
}
