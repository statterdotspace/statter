export type WorkspacePlan = 'free' | 'pro' | 'enterprise';

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  plan: WorkspacePlan;
  maxMembers: number;
  maxProjects: number;
  maxMonitors: number;
  inviteCode: string;
  membersCount?: number;
  createdAt: string;
  updatedAt: string;
}

export type WorkspaceMembershipRole = 'owner' | 'admin' | 'member';
export type WorkspaceMemberStatus = 'active' | 'invited';
export type WorkspaceInvitableRole = 'admin' | 'member';

export interface WorkspaceMemberRow {
  id: string;
  email: string;
  role: WorkspaceMembershipRole;
  status: WorkspaceMemberStatus;
}

export interface WorkspaceMembersListQuery {
  page?: number;
  perPage?: number;
}

export interface WorkspaceMembersListMeta {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
  currentUserRole: WorkspaceMembershipRole | null;
}

export interface WorkspaceMembersListResponse {
  data: WorkspaceMemberRow[];
  meta: WorkspaceMembersListMeta;
}

export interface WorkspaceInvitationItemPayload {
  email: string;
  role: WorkspaceInvitableRole;
}

export interface WorkspaceInviteMembersPayload {
  invitations: WorkspaceInvitationItemPayload[];
}

export interface WorkspaceInviteMembersResponse {
  data: WorkspaceMemberRow[];
  meta: {
    requested: number;
    invited: number;
    skipped: number;
  };
}

export interface AcceptInvitationResponse {
  workspaceId: string;
  workspaceSlug: string;
  workspaceName: string;
}

export interface CreateWorkspacePayload {
  name: string;
  slug?: string;
  logoUrl?: string;
}

export interface UpdateWorkspacePayload {
  name?: string;
  slug?: string;
  logoUrl?: string;
}
