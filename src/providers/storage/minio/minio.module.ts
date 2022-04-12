import { Module } from '@nestjs/common';
import { MinioModule } from 'nestjs-minio-client';
import { AppConfigModule } from 'src/config/app/config.module';
import { AppConfigService } from 'src/config/app/config.service';
import { MinioConfigModule } from 'src/config/storage/minio-client/config.module';
import { MinioConfigService } from 'src/config/storage/minio-client/config.service';
import { MinioProviderService } from './minio.service';

@Module({
  imports: [
    AppConfigModule,
    MinioConfigModule,
    MinioModule.registerAsync({
      imports: [AppConfigModule, MinioConfigModule],
      inject: [AppConfigService, MinioConfigService],
      useFactory: async (
        appConfigService: AppConfigService,
        minioConfigService: MinioConfigService,
      ) => ({
        endPoint: minioConfigService.host,
        port: minioConfigService.port,
        useSSL: Boolean(appConfigService.env === 'production'),
        accessKey: minioConfigService.accessKey,
        secretKey: minioConfigService.secretKey,
      }),
    }),
  ],
  providers: [MinioProviderService],
  exports: [MinioProviderService],
})
export class MinioProviderModule {}
