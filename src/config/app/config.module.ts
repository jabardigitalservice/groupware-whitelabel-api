import * as Joi from '@hapi/joi';
import { Module } from '@nestjs/common';
import configuration from './configuration';
import { AppConfigService } from './config.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      validationSchema: Joi.object({
        APP_ENV: Joi.string()
          .valid('development', 'production')
          .default('development'),
        APP_NAME: Joi.string().required(),
        APP_URL: Joi.string().required(),
        APP_PORT: Joi.number().default(3000),
        APP_LANGUAGE: Joi.string().default('id'),

        JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
        JWT_ACCESS_TOKEN_ALGORITHM: Joi.string().required(),
        JWT_ACCESS_TOKEN_EXPIRES_IN: Joi.string().required(),

        JWT_TYPE: Joi.string().required(),

        JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
        JWT_REFRESH_TOKEN_ALGORITHM: Joi.string().required(),
        JWT_REFRESH_TOKEN_EXPIRES_IN: Joi.string().required(),

        JWT_FORGOT_PASSWORD_TOKEN_SECRET: Joi.string().required(),
        JWT_FORGOT_PASSWORD_TOKEN_ALGORITHM: Joi.string().required(),
        JWT_FORGOT_PASSWORD_TOKEN_EXPIRES_IN: Joi.string().required(),

        GOOGLE_CLIENT_ID: Joi.string().required(),
        GOOGLE_CLIENT_SECRET: Joi.string().required(),
        GOOGLE_SCOPE: Joi.string().required(),
        GOOGLE_USER_PROFILE_URL: Joi.string().required(),

        DEFAULT_ADMIN_NAME: Joi.string().required(),
        DEFAULT_ADMIN_EMAIL: Joi.string().required(),
        DEFAULT_PASSWORD: Joi.string().required(),

        MAIL_HOST: Joi.string().required(),
        MAIL_USER: Joi.string().required(),
        MAIL_PASSWORD: Joi.string().required(),
        MAIL_FROM: Joi.string().required(),
      }),
    }),
  ],
  providers: [ConfigService, AppConfigService],
  exports: [ConfigService, AppConfigService],
})
export class AppConfigModule {}
