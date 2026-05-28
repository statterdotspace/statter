import { createParamDecorator, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { WorkspaceMemberOrm } from '@statter/database';
import { RequestContext } from '../../core/types/request-context.types';

export const Member = createParamDecorator(
  (data: keyof WorkspaceMemberOrm | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<RequestContext>();
    const member = request.workspaceMember;

    if (!member?.role) {
      throw new ForbiddenException('You do not have permission to modify members');
    }

    if (!data) {
      return member;
    }

    return member[data] ?? null;
  }
);
