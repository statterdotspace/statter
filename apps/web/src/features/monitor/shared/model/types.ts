import type { CreateMonitorPayload } from '@/entities';

export type MonitorFormValues = Omit<CreateMonitorPayload, 'projectId'>;
export type EditMonitorPayload = MonitorFormValues;
