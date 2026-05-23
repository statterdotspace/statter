import { MonitorRegion, MonitorStatus, MonitorType } from '@statter/database';
import { Exclude, Expose, Type } from 'class-transformer';
import { CheckResponseDto } from '../../../check/dto/response/check-response.dto';

@Exclude()
export class MonitorResponseDto {
  @Expose()
  id!: string;

  @Expose()
  workspaceId!: string;

  @Expose()
  projectId!: string;

  @Expose()
  createdById?: string;

  @Expose()
  name!: string;

  @Expose()
  description?: string;

  @Expose()
  url!: string;

  @Expose()
  type!: MonitorType;

  @Expose()
  region!: MonitorRegion;

  @Expose()
  intervalSeconds!: number;

  @Expose()
  timeoutMs!: number;

  @Expose()
  expectedStatus!: number;

  @Expose()
  status!: MonitorStatus;

  @Expose()
  lastCheckAt?: Date;

  @Expose()
  lastStatus?: string;

  @Expose()
  lastLatencyMs?: number;

  @Expose()
  createdAt!: Date;

  @Expose()
  updatedAt!: Date;

  @Expose()
  @Type(() => CheckResponseDto)
  lastCheck!: CheckResponseDto | null;
}
