import { ConfigService } from '@nestjs/config';
import * as Sentry from '@sentry/node';

const configService: ConfigService = new ConfigService();

Sentry.init({
  dsn: configService.get('SENTRY_DSN'),
  environment: configService.get('NODE_ENV'),
  integrations: [new Sentry.Integrations.Http({ tracing: true })],
  tracesSampleRate: Number(configService.get('SENTRY_SAMPLE_RATE', 0.0)),
});

export default Sentry;
