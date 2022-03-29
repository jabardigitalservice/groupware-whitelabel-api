import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailService } from './mail.service';
import { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppConfigModule } from 'src/config/app/config.module';
import { AppConfigService } from 'src/config/app/config.service';

@Module({
  imports: [
    AppConfigModule,
    ConfigModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule, AppConfigModule],
      inject: [ConfigService, AppConfigService],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get('MAIL_HOST'),
          secure: false,
          auth: {
            user: configService.get('MAIL_USER'),
            pass: configService.get('MAIL_PASSWORD'),
          },
        },
        defaults: {
          from: `"No Reply" <${configService.get('MAIL_FROM')}>`,
        },
        template: {
          dir: join(__dirname, '/views/mails'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
  providers: [MailService, ConfigService, AppConfigService],
  exports: [MailService],
})
export class MailModule {}
