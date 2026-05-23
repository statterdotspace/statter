import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { WorkspaceOrm } from '@statter/database';
import { RequestContext } from '../../core/types/request-context.types';

export const CurrentWorkspace = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): WorkspaceOrm | null => {
    const request = ctx.switchToHttp().getRequest<RequestContext>();
    return request.workspace ?? null;
  }
);
