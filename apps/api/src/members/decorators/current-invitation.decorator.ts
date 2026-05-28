import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { InvitationOrm } from '@statter/database';
import { RequestContext } from '../../core/types/request-context.types';

export const CurrentInvitation = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): InvitationOrm | null => {
    const request = ctx.switchToHttp().getRequest<RequestContext>();
    return request.currentInvitation ?? null;
  }
);
