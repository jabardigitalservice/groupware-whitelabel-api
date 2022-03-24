import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get env(): string {
    return this.configService.get<string>('app.APP_ENV');
  }
  get name(): string {
    return this.configService.get<string>('app.APP_NAME');
  }
  get url(): string {
    return this.configService.get<string>('app.APP_URL');
  }
  get port(): number {
    return Number(this.configService.get<number>('app.APP_PORT'));
  }
  get language(): string {
    return this.configService.get<string>('app.APP_LANGUAGE');
  }
}
