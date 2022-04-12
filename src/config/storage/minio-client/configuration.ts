import { registerAs } from '@nestjs/config';

export default registerAs('minio', () => ({
  MINIO_URL: process.env.MINIO_URL,
  MINIO_ENV: process.env.MINIO_ENV,
  MINIO_HOST: process.env.MINIO_HOST,
  MINIO_PORT: process.env.MINIO_PORT,
  MINIO_ACCESS_KEY: process.env.MINIO_ACCESS_KEY,
  MINIO_SECRET_KEY: process.env.MINIO_SECRET_KEY,
  MINIO_DEFAULT_REGION: process.env.MINIO_DEFAULT_REGION,
  MINIO_BUCKET: process.env.MINIO_BUCKET,
}));
