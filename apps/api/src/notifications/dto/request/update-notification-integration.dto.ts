import { IsBoolean, IsObject, IsOptional } from 'class-validator';

export class UpdateNotificationIntegrationDto {
  @IsObject()
  @IsOptional()
  config?: Record<string, unknown>;

  @IsBoolean()
  @IsOptional()
  enabled?: boolean;
}
