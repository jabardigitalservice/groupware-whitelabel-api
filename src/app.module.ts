import 'reflect-metadata';
import { Module } from '@nestjs/common';
import { ProjectsModule } from './models/projects/projects.module';
import { AuthModule } from './authentication/auth.module';
import { UserModule } from './models/users/users.module';
import { UserProfileModule } from './models/user-profiles/user-profiles.module';
import { UserSocialAccountModule } from './models/user-social-accounts/user-social-accounts.module';
import { AttendancesModule } from './models/attendances/attendances.module';
import { AppConfigModule } from './config/app/config.module';
import { PostgresConfigModule } from './config/database/postgres/config.module';
import { PostgresDatabaseProviderModule } from './providers/database/postgres/provider.module';
import { AppConfigService } from './config/app/config.service';

@Module({
  imports: [
    AppConfigModule,
    PostgresConfigModule,
    PostgresDatabaseProviderModule,
    ProjectsModule,
    AuthModule,
    UserModule,
    UserProfileModule,
    UserSocialAccountModule,
    AttendancesModule,
  ],
  providers: [AppConfigService],
})
export class AppModule {}
