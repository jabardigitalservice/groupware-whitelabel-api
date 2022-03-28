import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { User } from '@sentry/node';
import lang from 'src/common/language/configuration';
import { AppConfigService } from 'src/config/app/config.service';

@Injectable()
export class MailService {}
