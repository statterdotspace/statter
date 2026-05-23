import { MonitorRegion, MonitorStatus, MonitorType } from '@statter/database';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateMonitorDto {
  @IsUUID('4')
  projectId!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  description?: string;

  @IsUrl({ require_tld: false })
  @MaxLength(2048)
  url!: string;

  @IsEnum(MonitorType)
  type!: MonitorType;

  @IsEnum(MonitorRegion)
  region!: MonitorRegion;

  @IsOptional()
  @IsInt()
  @Min(10)
  @Max(86400)
  intervalSeconds?: number;

  @IsOptional()
  @IsInt()
  @Min(100)
  @Max(120000)
  timeoutMs?: number;

  @IsOptional()
  @IsInt()
  @Min(100)
  @Max(599)
  expectedStatus?: number;

  @IsOptional()
  @IsEnum(MonitorStatus)
  status?: MonitorStatus;
}
