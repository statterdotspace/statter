import { Type } from 'class-transformer';
import { MonitorRegion, MonitorStatus, MonitorType } from '@statter/database';
import { IsEnum, IsIn, IsInt, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';

export class ListMonitorsQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  perPage?: number = 10;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsIn(['createdAt', 'updatedAt', 'name', 'lastCheckAt'])
  sortBy?: 'createdAt' | 'updatedAt' | 'name' | 'lastCheckAt';

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC';

  @IsOptional()
  @IsEnum(MonitorStatus)
  status?: MonitorStatus;

  @IsOptional()
  @IsEnum(MonitorType)
  type?: MonitorType;

  @IsOptional()
  @IsEnum(MonitorRegion)
  region?: MonitorRegion;

  @IsOptional()
  @IsUUID('4')
  projectId?: string;
}
