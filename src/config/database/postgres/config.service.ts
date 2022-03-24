import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PostgresConfigService {
  constructor(private configService: ConfigService) {}

  get host(): string {
    return this.configService.get('postgres.POSTGRES_HOST');
  }
  get port(): number {
    return this.configService.get<number>('postgres.POSTGRES_PORT');
  }
  get username(): string {
    return this.configService.get('postgres.POSTGRES_USERNAME');
  }
  get password(): string {
    return this.configService.get('postgres.POSTGRES_PASSWORD');
  }
  get database(): string {
    return this.configService.get('postgres.POSTGRES_DATABASE');
  }
}
