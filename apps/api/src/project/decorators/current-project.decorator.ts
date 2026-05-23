import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ProjectOrm } from '@statter/database';
import { RequestContext } from '../../core/types/request-context.types';

export const CurrentProject = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): ProjectOrm | null => {
    const request = ctx.switchToHttp().getRequest<RequestContext>();
    return request.project ?? null;
  }
);
