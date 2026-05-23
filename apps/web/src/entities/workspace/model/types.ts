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
  membersCount?: number;
  createdAt: string;
  updatedAt: string;
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
