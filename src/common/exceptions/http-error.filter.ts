import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response, Request } from 'express';
import lang from 'src/language/configuration';
import {
  DevelopmentErrorResponse,
  HttpExceptionResponse,
} from '../interfaces/http-exception-response.interface';
import Sentry from '../../providers/logging/sentry/sentry.module';

@Catch()
export class HttpErrorFilter implements ExceptionFilter {
  private logger: Logger;
  constructor(private configService: ConfigService) {
    this.logger = new Logger();
  }
  catch(exception: Error, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    let statusCode: HttpStatus;
    let errorMessage: string;

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const errorResponse = exception.getResponse();
      errorMessage =
        (errorResponse as HttpExceptionResponse).error || exception.message;
    } else {
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      errorMessage = lang.__('common.error.internalServerError');
    }

    const developmentErrorResponse = this.getDevelopmentErrorResponse(
      statusCode,
      errorMessage,
      request,
    );

    const errorLog = this.getErrorLog(
      developmentErrorResponse,
      request,
      exception,
    );

    this.logger.error(errorLog);

    if (
      statusCode === HttpStatus.UNPROCESSABLE_ENTITY ||
      statusCode >= HttpStatus.INTERNAL_SERVER_ERROR
    ) {
      Sentry.captureException(exception, {
        tags: {
          level: 'error',
          userAgent: request.headers['user-agent'],
          ...developmentErrorResponse,
        },
        user: request.user,
      });
    }

    const environmentMode = this.configService.get('NODE_ENV');
    response
      .status(statusCode)
      .json(
        environmentMode !== 'production'
          ? developmentErrorResponse
          : this.getProductionErrorResponse(statusCode, errorMessage),
      );
  }

  private getDevelopmentErrorResponse = (
    status: HttpStatus,
    errorMessage: string,
    request: Request,
  ): DevelopmentErrorResponse => ({
    statusCode: status,
    error: errorMessage,
    path: request.url,
    method: request.method,
    timeStamp: new Date().toString(),
  });

  private getProductionErrorResponse = (
    status: HttpStatus,
    errorMessage: string,
  ): HttpExceptionResponse => ({
    statusCode: status,
    error: errorMessage,
  });

  private getErrorLog = (
    errorResponse: DevelopmentErrorResponse,
    request: Request,
    exception: unknown,
  ): string => {
    const { statusCode, error } = errorResponse;
    const { method, url } = request;

    return `Response Code: ${statusCode} - Method: ${method} - URL: ${url}\n\n
    ${JSON.stringify(errorResponse)}\n\n
    User: ${JSON.stringify(request.user ?? 'Not signed in')}\n\n
    ${exception instanceof HttpException ? exception.stack : error}\n\n`;
  };
}
