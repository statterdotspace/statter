import type {
  AcceptInvitationResponse,
  CreateWorkspacePayload,
  WorkspaceInviteMembersPayload,
  WorkspaceInviteMembersResponse,
  WorkspaceMembersListQuery,
  WorkspaceMembersListResponse,
  UpdateWorkspacePayload,
  Workspace,
} from '@/entities';
import type { SuccessResponse, UploadUrlPayload, UploadUrlResponse } from './types';
import { apiClient } from './api-client';

const workspaceApi = {
  async list(): Promise<Workspace[]> {
    const response = await apiClient.get<Workspace[]>('/workspaces');
    return response.data;
  },

  async getCurrent(): Promise<Workspace> {
    const response = await apiClient.get<Workspace>('/workspaces/current');
    return response.data;
  },

  async create(payload: CreateWorkspacePayload): Promise<Workspace> {
    const response = await apiClient.post<Workspace>('/workspaces', payload);
    return response.data;
  },

  async updateCurrent(payload: UpdateWorkspacePayload): Promise<Workspace> {
    const response = await apiClient.patch<Workspace>('/workspaces/current', payload);
    return response.data;
  },

  async deleteCurrent(): Promise<SuccessResponse> {
    const response = await apiClient.delete<SuccessResponse>('/workspaces/current');
    return response.data;
  },

  async generateLogoUploadUrl(payload: UploadUrlPayload): Promise<UploadUrlResponse> {
    const response = await apiClient.post<UploadUrlResponse>(
      '/workspaces/current/logo/upload-url',
      payload
    );
    return response.data;
  },

  async listMembers(query: WorkspaceMembersListQuery = {}): Promise<WorkspaceMembersListResponse> {
    const response = await apiClient.get<WorkspaceMembersListResponse>('/workspaces/current/members', {
      params: {
        page: query.page ?? 1,
        perPage: query.perPage ?? 10,
      },
    });
    return response.data;
  },

  async inviteMembers(payload: WorkspaceInviteMembersPayload): Promise<WorkspaceInviteMembersResponse> {
    const response = await apiClient.post<WorkspaceInviteMembersResponse>('/invitations', payload);
    return response.data;
  },

  async revokeInvitation(invitationId: string): Promise<SuccessResponse> {
    const response = await apiClient.delete<SuccessResponse>(`/invitations/${invitationId}`);
    return response.data;
  },

  async removeMember(memberId: string): Promise<SuccessResponse> {
    const response = await apiClient.delete<SuccessResponse>(`/workspaces/current/members/${memberId}`);
    return response.data;
  },

  async resetInviteCode(): Promise<Workspace> {
    const response = await apiClient.post<Workspace>('/workspaces/current/invite-code/reset');
    return response.data;
  },

  async acceptInvitation(token: string): Promise<AcceptInvitationResponse> {
    const response = await apiClient.post<AcceptInvitationResponse>(`/invitations/accept/${token}`);
    return response.data;
  },
};

export { workspaceApi };
