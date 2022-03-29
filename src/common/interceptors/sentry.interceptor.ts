import {
  ExecutionContext,
  Injectable,
  NestInterceptor,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import Sentry from '../../providers/logging/sentry/sentry.module';

@Injectable()
export class SentryInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();

    const transaction = Sentry.startTransaction({
      op: 'transaction',
      name: request.url,
    });

    Sentry.configureScope((scope) => {
      scope.setSpan(transaction);
    });

    transaction.finish();

    return next.handle().pipe(
      tap(null, () => {
        transaction.finish();
      }),
    );
  }
}
