import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AppConfigService } from '../../config/app/config.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(appConfigService: AppConfigService) {
    super({
      clientID: appConfigService.googleClientId,
      clientSecret: appConfigService.googleClientSecret,
      scope: appConfigService.googleScope,
      userProfileURL: appConfigService.googleUserProfileUrl,
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
