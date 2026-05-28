export type CheckStatus = 'up' | 'down' | 'degraded' | 'timeout';

export interface Check {
  id: string;
  monitorId: string;
  checkedAt: string;
  status: CheckStatus;
  statusCode: number | null;
  latencyMs: number | null;
  region: 'eu' | 'ua';
  responseSizeBytes: number | null;
  errorMessage: string | null;
}

export interface CheckListQuery {
  page?: number;
  limit?: number;
}

export interface CheckHistoryQuery {
  days?: number;
  limit?: number;
}
