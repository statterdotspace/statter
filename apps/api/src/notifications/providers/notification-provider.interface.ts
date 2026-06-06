import { NotificationChannel } from '@statter/database';
import { NotificationPayload } from '../types/notification.types';

export interface INotificationProvider {
  readonly channel: NotificationChannel;
  send(payload: NotificationPayload, config: Record<string, unknown>): Promise<void>;
}
