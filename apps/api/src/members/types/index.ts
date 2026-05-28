import { WorkspaceMemberRole } from '@statter/database';

export type UnifiedMemberRow = {
  id: string;
  email: string;
  role: WorkspaceMemberRole;
  status: 'active' | 'invited';
  createdAt: Date;
};
