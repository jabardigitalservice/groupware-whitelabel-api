import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { User } from '@sentry/node';
import lang from '../../common/language/configuration';
import { AppConfigService } from '../../config/app/config.service';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private appConfigService: AppConfigService,
  ) {}

  async sendForgotPassword(user: User, token: string, minute: number) {
    const url = `${this.appConfigService.forgotPasswordUrl}?token=${token}`;

    try {
      const mail = await this.mailerService.sendMail({
        to: user.email,
        subject: lang.__('mail.forgotPassword.subject'),
        template: './dist/views/mails/forgot-password',
        context: {
          name: user.name,
          url,
          minute,
        },
      });

      return mail;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
