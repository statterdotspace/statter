import { WorkspaceMemberRole } from '@statter/database';

export const INVITATION_EMAIL_REQUESTED_EVENT = 'workspace.invitation.email-requested';
export const INVITATIONS_EMAIL_REQUESTED_EVENT = 'workspace.invitations.email-requested';

export interface InvitationEmailRequestedEvent {
  email: string;
  workspaceName: string;
  role: WorkspaceMemberRole;
  inviteUrl: string;
}

export interface InvitationsEmailRequestedEvent {
  invitations: InvitationEmailRequestedEvent[];
}
