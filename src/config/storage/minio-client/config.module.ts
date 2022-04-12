import * as Joi from 'joi';
import { Module } from '@nestjs/common';
import configuration from './configuration';
import { MinioConfigService } from './config.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      validationSchema: Joi.object({
        MINIO_URL: Joi.string().required(),
        MINIO_ENV: Joi.string().required(),
        MINIO_HOST: Joi.string().required(),
        MINIO_PORT: Joi.number().required(),
        MINIO_ACCESS_KEY: Joi.string().required(),
        MINIO_SECRET_KEY: Joi.string().required(),
        MINIO_DEFAULT_REGION: Joi.string().required(),
        MINIO_BUCKET: Joi.string().required(),
      }),
    }),
  ],
  providers: [ConfigService, MinioConfigService],
  exports: [ConfigService, MinioConfigService],
})
export class MinioConfigModule {}
