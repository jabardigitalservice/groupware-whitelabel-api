import { Module } from '@nestjs/common';
import { MinioModule } from 'nestjs-minio-client';
import { MinioConfigModule } from 'src/config/storage/minio-client/config.module';
import { MinioConfigService } from 'src/config/storage/minio-client/config.service';
import { MinioProviderService } from './minio.service';

@Module({
  imports: [
    MinioConfigModule,
    MinioModule.registerAsync({
      imports: [MinioConfigModule],
      inject: [MinioConfigService],
      useFactory: async (minioConfigService: MinioConfigService) => ({
        endPoint: minioConfigService.host,
        port: minioConfigService.port,
        useSSL: false,
        accessKey: minioConfigService.accessKey,
        secretKey: minioConfigService.secretKey,
      }),
    }),
  ],
  providers: [MinioProviderService],
  exports: [MinioProviderService],
})
export class MinioProviderModule {}
