import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const isProduction = process.env.NODE_ENV === 'production';
export const PostgresConnectionOptions: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  ssl: isProduction,
  extra: {
    ssl: isProduction ? { rejectUnauthorized: false } : null,
  },
  logging: !isProduction,
  synchronize: false,
  entities: ['dist/models/**/entities/*.entity.js'],
};

export const OrmConfig = {
  ...PostgresConnectionOptions,
  migrations: ['src/database/migrations/*.{js,ts}'],
  cli: {
    migrationsDir: 'src/database/migrations',
  },
  factories: ['dist/database/factories/**/*.js'],
  seeds: ['dist/database/seeders/*.js'],
};

export default OrmConfig;
