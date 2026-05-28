import type {
  CreateMonitorPayload,
  MonitorRegion,
  MonitorStatus,
  MonitorType,
} from '../model/types';

export const monitorTypeOptions: MonitorType[] = ['https', 'http', 'tcp', 'ping'];
export const monitorRegionOptions: MonitorRegion[] = ['eu', 'ua', 'us', 'asia'];
export const monitorStatusOptions: MonitorStatus[] = ['active', 'paused', 'disabled'];

export const monitorStatusClass: Record<MonitorStatus, string> = {
  active: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  paused: 'border-yellow-200 bg-yellow-50 text-yellow-700',
  disabled: 'border-neutral-200 bg-neutral-100 text-neutral-600',
};

export const createMonitorDefaults: CreateMonitorPayload = {
  projectId: '',
  name: '',
  description: '',
  url: '',
  type: 'https',
  region: 'eu',
  intervalSeconds: 60,
  timeoutMs: 10000,
  expectedStatus: 200,
  status: 'active',
};
