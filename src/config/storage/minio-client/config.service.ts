import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MinioConfigService {
  constructor(private configService: ConfigService) {}

  get url(): string {
    return this.configService.get('minio.MINIO_URL');
  }

  get env(): string {
    return this.configService.get('minio.MINIO_ENV');
  }

  get host(): string {
    return this.configService.get('minio.MINIO_HOST');
  }

  get port(): number {
    return Number(this.configService.get('minio.MINIO_PORT'));
  }

  get accessKey(): string {
    return this.configService.get('minio.MINIO_ACCESS_KEY');
  }

  get secretKey(): string {
    return this.configService.get('minio.MINIO_SECRET_KEY');
  }

  get region(): string {
    return this.configService.get('minio.MINIO_DEFAULT_REGION');
  }

  get bucket(): string {
    return this.configService.get('minio.MINIO_BUCKET');
  }
}
