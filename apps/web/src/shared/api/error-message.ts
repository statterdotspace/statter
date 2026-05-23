import { AxiosError } from 'axios';

import type { ApiErrorResponse } from './types';

const getErrorMessage = (
  error: unknown,
  fallback = 'Something went wrong. Please try again.'
): string => {
  if (error instanceof AxiosError) {
    const response = error.response?.data as ApiErrorResponse | undefined;
    const message = response?.message;

    if (Array.isArray(message)) {
      return message.join(', ');
    }

    if (typeof message === 'string') {
      return message;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
};

export { getErrorMessage };
