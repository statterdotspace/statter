import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserOrm } from '@statter/database';
import { RequestWithOAuthUser } from '../types/guards.types';

export const OAuthUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): UserOrm | null => {
    const request = ctx.switchToHttp().getRequest<RequestWithOAuthUser>();
    const existingUser = request.existingUser;

    return existingUser ?? null;
  }
);
