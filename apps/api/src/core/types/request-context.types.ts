import { Request } from 'express';
import {
  InvitationOrm,
  MonitorOrm,
  ProjectOrm,
  UserOrm,
  WorkspaceMemberOrm,
  WorkspaceOrm,
} from '@statter/database';

export interface RequestContext extends Request {
  user?: UserOrm;
  workspaceId?: string;
  workspace?: WorkspaceOrm;
  workspaceMember?: WorkspaceMemberOrm;
  currentInvitation?: InvitationOrm;
  currentMember?: WorkspaceMemberOrm;
  project?: ProjectOrm;
  monitor?: MonitorOrm;
}
