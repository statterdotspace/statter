export type NotificationChannel = 'email' | 'telegram' | 'slack';

export interface WorkspaceIntegration {
  id: string;
  workspaceId: string;
  channel: NotificationChannel;
  config: Record<string, unknown>;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateIntegrationPayload {
  channel: NotificationChannel;
  config: Record<string, unknown>;
  enabled?: boolean;
}

export interface UpdateIntegrationPayload {
  config?: Record<string, unknown>;
  enabled?: boolean;
}
