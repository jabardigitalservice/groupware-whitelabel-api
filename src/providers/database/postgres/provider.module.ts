import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostgresConnectionOptions } from 'src/config/database/postgres/config.orm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () => ({
        ...PostgresConnectionOptions,
      }),
    }),
  ],
})
export class PostgresDatabaseProviderModule {}
