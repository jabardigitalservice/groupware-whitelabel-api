import 'reflect-metadata';
import { Module } from '@nestjs/common';
import { SentryInterceptor } from './common/interceptors/sentry.interceptor';
import { ProjectsModule } from './models/projects/projects.module';
import { AuthModule } from './authentication/auth.module';
import { UserModule } from './models/users/users.module';
import { UserProfileModule } from './models/user-profiles/user-profiles.module';
import { UserSocialAccountModule } from './models/user-social-accounts/user-social-accounts.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpErrorFilter } from './common/exceptions/http-error.filter';
import { AttendancesModule } from './models/attendances/attendances.module';
import { AppConfigModule } from './config/app/config.module';
import { PostgresConfigModule } from './config/database/postgres/config.module';
import { PostgresDatabaseProviderModule } from './providers/database/postgres/provider.module';
import { AppConfigService } from './config/app/config.service';
import { PostgresConfigService } from './config/database/postgres/config.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduledAttendancesAutoCheckoutModule } from './cron/attendances/scheduled-auto-checkout.module';
import { MailModule } from './providers/mail/mail.module';
import { DaysOffModule } from './models/days-off/days-off.module';
import { DaysOffService } from './models/days-off/days-off.service';
import { JobTitlesModule } from './models/job-titles/job-titles.module';

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
    MailModule,
    DaysOffModule,
    JobTitlesModule,
  ],
  providers: [
    ConfigService,
    AppConfigService,
    PostgresConfigService,
    {
      provide: APP_INTERCEPTOR,
      useClass: SentryInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpErrorFilter,
    },
    DaysOffService,
  ],
})
export class AppModule {}
