import { UserOrm } from '@statter/database';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const CurrentUser = createParamDecorator(
  (data: keyof UserOrm | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const user = request.user;

    if (!data) {
      return user ?? null;
    }

    return user ? user[data] : null;
  }
);
