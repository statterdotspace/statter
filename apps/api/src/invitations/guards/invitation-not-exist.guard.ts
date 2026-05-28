import { CanActivate, ExecutionContext, Injectable, NotFoundException } from '@nestjs/common';
import { InvitationsService } from '../invitations.service';
import { RequestContext } from '../../core/types/request-context.types';

@Injectable()
export class InvitationNotExistsGuard implements CanActivate {
  constructor(private readonly invitationsService: InvitationsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestContext>();

    const token = request.params?.['token'];

    if (typeof token !== 'string' || token.length === 0) {
      throw new NotFoundException('Invitation token is required');
    }

    const invitation = await this.invitationsService.findByToken(token);

    if (!invitation) {
      throw new NotFoundException('Invitation not found');
    }

    request.currentInvitation = invitation;

    return true;
  }
}
