import 'reflect-metadata';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ProjectsModule } from './models/projects/projects.module';
import { AuthModule } from './authentication/auth.module';
import { UserModule } from './models/users/users.module';
import { UserProfileModule } from './models/user-profiles/user-profiles.module';
import { UserSocialAccountModule } from './models/user-social-accounts/user-social-accounts.module';
import { APP_FILTER } from '@nestjs/core';
import { HttpErrorFilter } from './common/exceptions/http-error.filter';
import { AttendancesModule } from './models/attendances/attendances.module';
import { AppConfigModule } from './config/app/config.module';
import { PostgresConfigModule } from './config/database/postgres/config.module';
import { PostgresDatabaseProviderModule } from './providers/database/postgres/provider.module';
import { AppConfigService } from './config/app/config.service';
import { PostgresConfigService } from './config/database/postgres/config.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduledAttendancesAutoCheckoutModule } from './cron/attendances/scheduled-auto-checkout.module';

@Module({
  imports: [
    ConfigModule,
    AppConfigModule,
    PostgresConfigModule,
    PostgresDatabaseProviderModule,
    ProjectsModule,
    AuthModule,
    UserModule,
    UserProfileModule,
    UserSocialAccountModule,
    AttendancesModule,
    ScheduledAttendancesAutoCheckoutModule,
  ],
  providers: [
    ConfigService,
    AppConfigService,
    PostgresConfigService,
    {
      provide: APP_FILTER,
      useClass: HttpErrorFilter,
    },
  ],
})
export class AppModule {}
