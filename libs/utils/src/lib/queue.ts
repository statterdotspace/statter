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
  degradedThresholdMs: number | null;
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

export const CHECK_RESULTS_EXCHANGE_DEFAULT = 'check_results';
export const getCheckResultsQueueName = (region: string): string => `check_results_${region}`;

export const getChecksDlxName = (): string => 'checks.dlx';
export const getChecksDlqName = (region: string): string => `checks_${region}.dlq`;

export const getCheckResultsDlxName = (): string => 'check_results.dlx';
export const getCheckResultsDlqName = (region: string): string => `check_results_${region}.dlq`;
