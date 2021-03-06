import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  APP_ENV: process.env.APP_ENV,
  APP_NAME: process.env.APP_NAME,
  APP_URL: process.env.APP_URL,
  APP_PORT: process.env.APP_PORT,
  APP_LANGUAGE: process.env.APP_LANGUAGE,

  AUTO_CHECK_OUT_TIME: process.env.AUTO_CHECK_OUT_TIME,

  JWT_ACCESS_TOKEN_SECRET: process.env.JWT_ACCESS_TOKEN_SECRET,
  JWT_ACCESS_TOKEN_ALGORITHM: process.env.JWT_ACCESS_TOKEN_ALGORITHM,
  JWT_ACCESS_TOKEN_EXPIRES_IN: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,

  JWT_TYPE: process.env.JWT_TYPE,

  JWT_REFRESH_TOKEN_SECRET: process.env.JWT_REFRESH_TOKEN_SECRET,
  JWT_REFRESH_TOKEN_ALGORITHM: process.env.JWT_REFRESH_TOKEN_ALGORITHM,
  JWT_REFRESH_TOKEN_EXPIRES_IN: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,

  JWT_FORGOT_PASSWORD_TOKEN_SECRET:
    process.env.JWT_FORGOT_PASSWORD_TOKEN_SECRET,
  JWT_FORGOT_PASSWORD_TOKEN_ALGORITHM:
    process.env.JWT_FORGOT_PASSWORD_TOKEN_ALGORITHM,
  JWT_FORGOT_PASSWORD_TOKEN_EXPIRES_IN:
    process.env.JWT_FORGOT_PASSWORD_TOKEN_EXPIRES_IN,

  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GOOGLE_SCOPE: process.env.GOOGLE_SCOPE,
  GOOGLE_USER_PROFILE_URL: process.env.GOOGLE_USER_PROFILE_URL,

  DEFAULT_ADMIN_NAME: process.env.DEFAULT_ADMIN_NAME,
  DEFAULT_ADMIN_EMAIL: process.env.DEFAULT_ADMIN_EMAIL,
  DEFAULT_PASSWORD: process.env.DEFAULT_PASSWORD,

  MAIL_HOST: process.env.MAIL_HOST,
  MAIL_USER: process.env.MAIL_USER,
  MAIL_PASSWORD: process.env.MAIL_PASSWORD,
  MAIL_FROM: process.env.MAIL_FROM,

  FORGOT_PASSWORD_URL: process.env.FORGOT_PASSWORD_URL,
}));
