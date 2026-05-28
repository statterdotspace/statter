import type { Check } from '@/entities/check';

export type MonitorType = 'http' | 'https' | 'tcp' | 'ping';
export type MonitorRegion = 'eu' | 'ua' | 'us' | 'asia';
export type MonitorStatus = 'active' | 'paused' | 'disabled';

export interface Monitor {
  id: string;
  workspaceId: string;
  projectId: string;
  createdById?: string;
  name: string;
  description?: string;
  url: string;
  type: MonitorType;
  region: MonitorRegion;
  intervalSeconds: number;
  timeoutMs: number;
  expectedStatus: number;
  status: MonitorStatus;
  lastCheckAt?: string;
  lastStatus?: string;
  lastLatencyMs?: number;
  createdAt: string;
  updatedAt: string;
  lastCheck: Check | null;
}

export interface MonitorListQuery {
  page?: number;
  perPage?: number;
  projectId?: string;
  search?: string;
  sortBy?: 'createdAt' | 'updatedAt' | 'name' | 'lastCheckAt';
  sortOrder?: 'ASC' | 'DESC';
  status?: MonitorStatus;
  type?: MonitorType;
  region?: MonitorRegion;
}

export interface CreateMonitorPayload {
  projectId: string;
  name: string;
  description?: string;
  url: string;
  type: MonitorType;
  region: MonitorRegion;
  intervalSeconds?: number;
  timeoutMs?: number;
  expectedStatus?: number;
  status?: MonitorStatus;
}

export interface UpdateMonitorPayload {
  name?: string;
  description?: string;
  url?: string;
  type?: MonitorType;
  region?: MonitorRegion;
  intervalSeconds?: number;
  timeoutMs?: number;
  expectedStatus?: number;
  status?: MonitorStatus;
}
