import { IsEnum } from 'class-validator';

export type StatsPeriod = '24h' | '7d' | '30d';

export class MonitorStatsQueryDto {
  @IsEnum(['24h', '7d', '30d'])
  period: StatsPeriod = '24h';
}
