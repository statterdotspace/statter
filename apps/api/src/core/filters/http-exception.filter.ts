import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { isString } from 'class-validator';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const isProduction = process.env.NODE_ENV === 'production';

    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const error =
      exception instanceof HttpException ? exception.getResponse() : null;

    const fallbackMessage =
      !isProduction && exception instanceof Error
        ? exception.message
        : 'Internal server error';

    const message = isString(error)
      ? error
      : ((error as Error)?.message ?? fallbackMessage);

    response.status(statusCode).json({
      statusCode,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message,
    });
  }
}
