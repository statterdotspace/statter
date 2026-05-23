import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { MonitorOrm } from '@statter/database';
import { RequestContext } from '../../core/types/request-context.types';

export const CurrentMonitor = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): MonitorOrm | null => {
    const request = ctx.switchToHttp().getRequest<RequestContext>();
    return request.monitor ?? null;
  }
);
