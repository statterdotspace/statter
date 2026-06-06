import { IsBoolean, IsEnum, IsObject, IsOptional } from 'class-validator';
import { NotificationChannel } from '@statter/database';

export class CreateNotificationIntegrationDto {
  @IsEnum(NotificationChannel)
  channel!: NotificationChannel;

  @IsObject()
  config!: Record<string, unknown>;

  @IsBoolean()
  @IsOptional()
  enabled?: boolean;
}
