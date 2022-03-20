import 'reflect-metadata';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configValidationSchema } from './config.schema';
import { DatabaseConnection } from './config/database/connection';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './users/users.module';
import { UserProfileModule } from './user-profiles/user-profiles.module';
import { UserSocialAccountModule } from './user-social-accounts/user-social-accounts.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: configValidationSchema,
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConnection,
    }),
    AuthModule,
    UserModule,
    UserProfileModule,
    UserSocialAccountModule,
  ],
})
export class AppModule {}
