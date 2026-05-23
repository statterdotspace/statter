import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ConflictException,
  ExceptionFilter,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { isObject } from 'class-validator';
import { PostgresErrorCause, PostgresErrorCode } from './filters.types';
import { PG_ERROR_CODES } from './filters.constants';

@Catch()
export class DatabaseExceptionFilter implements ExceptionFilter {
  private readonly errorMap: Partial<
    Record<PostgresErrorCode, (error: PostgresErrorCause) => HttpException>
  > = {
    [PG_ERROR_CODES.UNIQUE_VIOLATION]: (error) =>
      new ConflictException(error.detail ?? 'Resource with provided unique field already exists.'),

    [PG_ERROR_CODES.FOREIGN_KEY_VIOLATION]: (error) =>
      new BadRequestException(error.detail ?? 'Referenced resource does not exist.'),

    [PG_ERROR_CODES.NOT_NULL_VIOLATION]: (error) =>
      new BadRequestException(
        error.column ? `Field "${error.column}" is required.` : 'Required field is missing.'
      ),

    [PG_ERROR_CODES.UNDEFINED_COLUMN]: () =>
      new InternalServerErrorException('Database column does not exist.'),

    [PG_ERROR_CODES.UNDEFINED_TABLE]: () =>
      new InternalServerErrorException('Database table does not exist.'),

    [PG_ERROR_CODES.INVALID_TEXT_REPRESENTATION]: () =>
      new BadRequestException('Invalid input syntax for database field.'),

    [PG_ERROR_CODES.CHECK_VIOLATION]: (error) =>
      new BadRequestException(error.detail ?? 'Database constraint validation failed.'),

    [PG_ERROR_CODES.NO_DATA_FOUND]: () =>
      new NotFoundException('Requested database resource was not found.'),
  };

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const httpException = this.mapException(exception);

    response.status(httpException.getStatus()).json({
      statusCode: httpException.getStatus(),
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: httpException.message,
    });
  }

  private mapException(exception: unknown): HttpException {
    if (exception instanceof HttpException) {
      return exception;
    }

    const cause = this.extractCause(exception);
    const handler = cause.code ? this.errorMap[cause.code as PostgresErrorCode] : undefined;

    return handler?.(cause) ?? new InternalServerErrorException('Database query failed.');
  }

  private extractCause(exception: unknown): PostgresErrorCause {
    if (isObject(exception)) {
      const object = exception as Record<string, unknown>;
      return {
        code: typeof object['code'] === 'string' ? object['code'] : undefined,
        detail: typeof object['detail'] === 'string' ? object['detail'] : undefined,
        column: typeof object['column'] === 'string' ? object['column'] : undefined,
        message: typeof object['message'] === 'string' ? object['message'] : undefined,
      };
    }

    if (exception instanceof Error) {
      return { message: exception.message };
    }

    return { message: 'Unknown database error' };
  }
}
