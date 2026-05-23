import { PG_ERROR_CODES } from './filters.constants';

export type PostgresErrorCode =
  (typeof PG_ERROR_CODES)[keyof typeof PG_ERROR_CODES];

export interface PostgresErrorCause {
  code?: string;
  detail?: string;
  column?: string;
  message?: string;
}
