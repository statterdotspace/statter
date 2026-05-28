import { randomBytes } from 'crypto';
import { INVITATION_TOKEN_BYTES } from '../constants/invitation.constants';

export const createInvitationToken = () => {
  return randomBytes(INVITATION_TOKEN_BYTES).toString('base64url');
};

