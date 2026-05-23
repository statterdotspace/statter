import type { PaginatedResponse } from './types';

const normalizePaginated = <T>(
  payload: PaginatedResponse<T> | T[],
  page: number,
  perPage: number
): PaginatedResponse<T> => {
  if (Array.isArray(payload)) {
    const total = payload.length;
    const start = (page - 1) * perPage;
    const end = start + perPage;

    return {
      data: payload.slice(start, end),
      meta: {
        page,
        perPage,
        total,
        totalPages: Math.max(1, Math.ceil(total / perPage)),
      },
    };
  }

  return payload;
};

export { normalizePaginated };
