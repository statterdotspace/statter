import { NotificationChannel } from '@statter/database';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class WorkspaceIntegrationResponseDto {
  @Expose()
  id!: string;

  @Expose()
  workspaceId!: string;

  @Expose()
  channel!: NotificationChannel;

  @Expose()
  config!: Record<string, unknown>;

  @Expose()
  enabled!: boolean;

  @Expose()
  createdAt!: Date;

  @Expose()
  updatedAt!: Date;
}
