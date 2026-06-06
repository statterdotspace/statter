import { CheckStatus } from '@statter/database';

export interface NotificationPayload {
  monitorId: string;
  monitorName: string;
  monitorUrl: string;
  workspaceId: string;
  projectId: string;
  region: string;
  status: CheckStatus;
  statusCode: number | null;
  latencyMs: number | null;
  errorMessage: string | null;
  checkedAt: Date;
}

export interface EmailNotificationConfig {
  email: string;
}

export interface TelegramNotificationConfig {
  botToken: string;
  chatId: string;
}

export interface SlackNotificationConfig {
  webhookUrl: string;
}
