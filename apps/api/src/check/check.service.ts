import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { CheckOrm, MonitorOrm } from '@statter/database';
import { MoreThan, Repository } from 'typeorm';
import { CreateCheckResultDto } from './dto/request/create-check-result.dto';
import {
  CHECK_RESULT_INGESTED_EVENT,
  CheckRealtimeMonitorSnapshot,
} from './events/check-result-ingested.event';
import type { StatsPeriod } from './dto/request/monitor-stats-query.dto';
import type {
  ChartBucket,
  DailyUptimeBar,
  MonitorStatsResponse,
} from './dto/response/monitor-stats-response.dto';

const periodToHours: Record<StatsPeriod, number> = {
  '24h': 24,
  '7d': 168,
  '30d': 720,
};

@Injectable()
export class CheckService {
  constructor(
    @InjectRepository(CheckOrm)
    private readonly checkRepo: Repository<CheckOrm>,
    @InjectRepository(MonitorOrm)
    private readonly monitorRepo: Repository<MonitorOrm>,
    private readonly eventEmitter: EventEmitter2
  ) {}

  async findManyByMonitorId(monitorId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [data, total] = await this.checkRepo.findAndCount({
      where: { monitorId },
      order: { checkedAt: 'DESC' },
      skip,
      take: limit,
    });

    return {
      data,
      meta: {
        page,
        perPage: limit,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    };
  }

  async findLatestByMonitorId(monitorId: string) {
    return await this.checkRepo.findOne({
      where: { monitorId },
      order: { checkedAt: 'DESC' },
    });
  }

  async findRecentByMonitorId(monitorId: string, days: number, limit: number) {
    const fromDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    return await this.checkRepo.find({
      where: {
        monitorId,
        checkedAt: MoreThan(fromDate),
      },
      order: { checkedAt: 'DESC' },
      take: limit,
    });
  }

  async getStats(monitorId: string, period: StatsPeriod): Promise<MonitorStatsResponse> {
    const hours = periodToHours[period];
    const periodSeconds = hours * 3600;
    const bucketTrunc = hours <= 24 ? 'hour' : 'day';

    const [aggregateRow] = await this.checkRepo.query<
      Array<{
        avg_ms: string | null;
        p50_ms: string | null;
        p95_ms: string | null;
        p99_ms: string | null;
        total_checks: string;
        up_checks: string;
        down_checks: string;
        timeout_checks: string;
        degraded_checks: string;
        uptime_pct: string | null;
        downtime_minutes: string | null;
      }>
    >(
      `
      WITH period_checks AS (
        SELECT
          status,
          latency_ms,
          checked_at,
          LEAD(checked_at) OVER (ORDER BY checked_at) AS next_checked_at
        FROM checks
        WHERE monitor_id = $1
          AND checked_at > NOW() - ($2 * INTERVAL '1 second')
      ),
      latency_stats AS (
        SELECT
          ROUND(AVG(latency_ms))::bigint                                                              AS avg_ms,
          ROUND(percentile_cont(0.50) WITHIN GROUP (ORDER BY latency_ms))::bigint                    AS p50_ms,
          ROUND(percentile_cont(0.95) WITHIN GROUP (ORDER BY latency_ms))::bigint                    AS p95_ms,
          ROUND(percentile_cont(0.99) WITHIN GROUP (ORDER BY latency_ms))::bigint                    AS p99_ms,
          COUNT(*)                                                                                     AS total_checks,
          COUNT(*) FILTER (WHERE status = 'up')                                                       AS up_checks,
          COUNT(*) FILTER (WHERE status = 'down')                                                     AS down_checks,
          COUNT(*) FILTER (WHERE status = 'timeout')                                                  AS timeout_checks,
          COUNT(*) FILTER (WHERE status = 'degraded')                                                 AS degraded_checks
        FROM period_checks
      ),
      uptime_calc AS (
        SELECT
          ROUND(
            COALESCE(
              SUM(EXTRACT(EPOCH FROM (next_checked_at - checked_at))) FILTER (WHERE status = 'up')::numeric
                / NULLIF(SUM(EXTRACT(EPOCH FROM (next_checked_at - checked_at)))::numeric, 0) * 100,
              100
            ), 2
          ) AS uptime_pct,
          ROUND(
            COALESCE(
              SUM(EXTRACT(EPOCH FROM (next_checked_at - checked_at))) FILTER (WHERE status != 'up')::numeric / 60,
              0
            ), 1
          ) AS downtime_minutes
        FROM period_checks
        WHERE next_checked_at IS NOT NULL
      )
      SELECT ls.*, uc.uptime_pct, uc.downtime_minutes
      FROM latency_stats ls, uptime_calc uc
      `,
      [monitorId, periodSeconds]
    );

    const chartRows = await this.checkRepo.query<
      Array<{
        bucket: string;
        region: string;
        avg_ms: string | null;
        p95_ms: string | null;
        total_checks: string;
        up_checks: string;
      }>
    >(
      `
      SELECT
        DATE_TRUNC($3, checked_at)                                                      AS bucket,
        region,
        ROUND(AVG(latency_ms))::bigint                                                  AS avg_ms,
        ROUND(percentile_cont(0.95) WITHIN GROUP (ORDER BY latency_ms))::bigint         AS p95_ms,
        COUNT(*)                                                                         AS total_checks,
        COUNT(*) FILTER (WHERE status = 'up')                                           AS up_checks
      FROM checks
      WHERE monitor_id = $1
        AND checked_at > NOW() - ($2 * INTERVAL '1 second')
        AND latency_ms IS NOT NULL
      GROUP BY bucket, region
      ORDER BY bucket ASC
      `,
      [monitorId, periodSeconds, bucketTrunc]
    );

    const dailyRows = await this.checkRepo.query<
      Array<{ day: string; uptime_pct: string; total_checks: string }>
    >(
      `
      SELECT
        DATE_TRUNC('day', checked_at) AS day,
        ROUND(
          COUNT(*) FILTER (WHERE status = 'up')::numeric
            / NULLIF(COUNT(*)::numeric, 0) * 100,
          2
        ) AS uptime_pct,
        COUNT(*) AS total_checks
      FROM checks
      WHERE monitor_id = $1
        AND checked_at > NOW() - INTERVAL '30 days'
      GROUP BY day
      ORDER BY day ASC
      `,
      [monitorId]
    );

    const chart: ChartBucket[] = chartRows.map((r) => ({
      bucket: new Date(r.bucket).toISOString(),
      region: r.region,
      avgMs: r.avg_ms !== null ? Number(r.avg_ms) : null,
      p95Ms: r.p95_ms !== null ? Number(r.p95_ms) : null,
      totalChecks: Number(r.total_checks),
      upChecks: Number(r.up_checks),
    }));

    const dailyUptime: DailyUptimeBar[] = dailyRows.map((r) => ({
      day: new Date(r.day).toISOString(),
      uptimePct: Number(r.uptime_pct),
      totalChecks: Number(r.total_checks),
    }));

    return {
      period,
      uptimePct: aggregateRow.uptime_pct !== null ? Number(aggregateRow.uptime_pct) : 100,
      downtimeMinutes:
        aggregateRow.downtime_minutes !== null ? Number(aggregateRow.downtime_minutes) : 0,
      avgMs: aggregateRow.avg_ms !== null ? Number(aggregateRow.avg_ms) : null,
      p50Ms: aggregateRow.p50_ms !== null ? Number(aggregateRow.p50_ms) : null,
      p95Ms: aggregateRow.p95_ms !== null ? Number(aggregateRow.p95_ms) : null,
      p99Ms: aggregateRow.p99_ms !== null ? Number(aggregateRow.p99_ms) : null,
      totalChecks: Number(aggregateRow.total_checks),
      upChecks: Number(aggregateRow.up_checks),
      downChecks: Number(aggregateRow.down_checks),
      timeoutChecks: Number(aggregateRow.timeout_checks),
      degradedChecks: Number(aggregateRow.degraded_checks),
      chart,
      dailyUptime,
    };
  }

  async getUptime30dBatch(monitorIds: string[]): Promise<Map<string, number>> {
    if (monitorIds.length === 0) return new Map();

    const rows = await this.checkRepo.query<Array<{ monitor_id: string; uptime_pct: string }>>(
      `
      WITH period_checks AS (
        SELECT
          monitor_id,
          status,
          checked_at,
          LEAD(checked_at) OVER (PARTITION BY monitor_id ORDER BY checked_at) AS next_checked_at
        FROM checks
        WHERE monitor_id = ANY($1::uuid[])
          AND checked_at > NOW() - INTERVAL '30 days'
      )
      SELECT
        monitor_id,
        ROUND(
          COALESCE(
            SUM(EXTRACT(EPOCH FROM (next_checked_at - checked_at))) FILTER (WHERE status = 'up')::numeric
              / NULLIF(SUM(EXTRACT(EPOCH FROM (next_checked_at - checked_at)))::numeric, 0) * 100,
            100
          ), 2
        ) AS uptime_pct
      FROM period_checks
      WHERE next_checked_at IS NOT NULL
      GROUP BY monitor_id
      `,
      [monitorIds]
    );

    return new Map(rows.map((r) => [r.monitor_id, Number(r.uptime_pct)]));
  }

  async ingestCheckResult(payload: CreateCheckResultDto, monitor: MonitorOrm) {
    const checkedAt = new Date(payload.checkedAt);

    const check = await this.checkRepo.save({
      monitorId: payload.monitorId,
      checkedAt,
      status: payload.status,
      statusCode: payload.statusCode,
      latencyMs: payload.latencyMs,
      region: payload.region,
      responseSizeBytes: payload.responseSizeBytes,
      errorMessage: payload.errorMessage,
    });

    await this.monitorRepo.update(monitor.id, {
      lastCheckAt: checkedAt,
      lastStatus: payload.status,
      lastLatencyMs: payload.latencyMs ?? null,
    });

    const monitorSnapshot: CheckRealtimeMonitorSnapshot = {
      id: monitor.id,
      lastCheckAt: checkedAt,
      lastStatus: payload.status,
      lastLatencyMs: payload.latencyMs ?? null,
    };

    await this.eventEmitter.emitAsync(CHECK_RESULT_INGESTED_EVENT, {
      workspaceId: monitor.workspaceId,
      monitorId: monitor.id,
      check,
      monitor: monitorSnapshot,
      monitorEntity: {
        ...monitor,
        ...monitorSnapshot,
      },
    });

    return {
      monitor: {
        ...monitor,
        ...monitorSnapshot,
      },
      check,
    };
  }
}
