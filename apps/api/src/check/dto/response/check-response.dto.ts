import { CheckStatus, MonitorRegion } from '@statter/database';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class CheckResponseDto {
  @Expose()
  id!: string;

  @Expose()
  monitorId!: string;

  @Expose()
  checkedAt!: Date;

  @Expose()
  status!: CheckStatus;

  @Expose()
  statusCode!: number | null;

  @Expose()
  latencyMs!: number | null;

  @Expose()
  region!: MonitorRegion;

  @Expose()
  responseSizeBytes!: number | null;

  @Expose()
  errorMessage!: string | null;
}
