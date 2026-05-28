import { CheckStatus, MonitorRegion } from '@statter/database';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateCheckResultDto {
  @IsUUID('4')
  monitorId!: string;

  @IsDateString()
  checkedAt!: string;

  @IsEnum(MonitorRegion)
  region: MonitorRegion = MonitorRegion.EU;

  @IsEnum(CheckStatus)
  status!: CheckStatus;

  @IsOptional()
  @IsInt()
  @Min(100)
  @Max(599)
  statusCode?: number | null;

  @IsOptional()
  @IsInt()
  @Min(0)
  latencyMs?: number | null;

  @IsOptional()
  @IsInt()
  @Min(0)
  responseSizeBytes?: number | null;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  errorMessage?: string | null;
}
