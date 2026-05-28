export const CHECKS_EXCHANGE_DEFAULT = 'checks';

export interface CheckJobPayload {
  jobId: string;
  monitorId: string;
  workspaceId: string;
  projectId: string;
  url: string;
  type: string;
  region: string;
  timeoutMs: number;
  expectedStatus: number;
  queuedAt: string;
}

export interface CheckResultPayload {
  monitorId: string;
  checkedAt: string;
  region: string;
  status: 'up' | 'down' | 'degraded' | 'timeout';
  statusCode: number | null;
  latencyMs: number | null;
  responseSizeBytes: number | null;
  errorMessage: string | null;
}

export const getChecksQueueName = (region: string): string => `checks_${region}`;
