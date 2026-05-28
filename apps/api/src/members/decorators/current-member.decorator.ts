import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { WorkspaceMemberOrm } from '@statter/database';
import { RequestContext } from '../../core/types/request-context.types';

export const CurrentMember = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): WorkspaceMemberOrm | null => {
    const request = ctx.switchToHttp().getRequest<RequestContext>();
    return request.currentMember ?? null;
  }
);
