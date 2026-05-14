import { ClassConstructor, plainToInstance } from 'class-transformer';

export function toDto<T, V>(cls: ClassConstructor<T>, data: V): T {
  return plainToInstance(cls, data, {
    excludeExtraneousValues: true,
  });
}

export function toPaginatedDto<T, V, M>(
  cls: ClassConstructor<T>,
  result: { data: V[]; meta: M }
): { data: T[]; meta: M } {
  return {
    data: plainToInstance(cls, result.data, {
      excludeExtraneousValues: true,
    }),
    meta: result.meta,
  };
}
