import 'reflect-metadata';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configValidationSchema } from './config.schema';
import { ProjectsModule } from './projects/projects.module';
import { DatabaseConnection } from './config/database/connection';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './users/users.module';
import { UserProfileModule } from './user-profiles/user-profiles.module';
import { UserSocialAccountModule } from './user-social-accounts/user-social-accounts.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpErrorFilter } from './common/exceptions/http-error.filter';
import { AttendancesModule } from './models/attendances/attendances.module';
import { SentryInterceptor } from './common/interceptors/sentry.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: configValidationSchema,
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConnection,
    }),
    ProjectsModule,
    AuthModule,
    UserModule,
    UserProfileModule,
    UserSocialAccountModule,
    AttendancesModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: SentryInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpErrorFilter,
    },
  ],
})
export class AppModule {}
