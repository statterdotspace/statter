import { Request } from 'express';
import { MonitorOrm, ProjectOrm, UserOrm, WorkspaceMemberOrm, WorkspaceOrm } from '@statter/database';

export interface RequestContext extends Request {
  user?: UserOrm;
  workspaceId?: string;
  workspace?: WorkspaceOrm;
  workspaceMember?: WorkspaceMemberOrm;
  project?: ProjectOrm;
  monitor?: MonitorOrm;
}
