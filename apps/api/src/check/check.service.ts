import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { CheckOrm, MonitorOrm } from '@statter/database';
import { MoreThan, Repository } from 'typeorm';
import { CreateCheckResultDto } from './dto/request/create-check-result.dto';
import {
  CHECK_RESULT_INGESTED_EVENT,
  CheckRealtimeMonitorSnapshot,
} from './events/check-result-ingested.event';

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

  logFailure(monitor: MonitorOrm, check: CheckOrm): void {
    const basePayload = {
      monitorId: monitor.id,
      monitorName: monitor.name,
      workspaceId: monitor.workspaceId,
      projectId: monitor.projectId,
      region: check.region,
      status: check.status,
      statusCode: check.statusCode,
      latencyMs: check.latencyMs,
      errorMessage: check.errorMessage,
      checkedAt: check.checkedAt,
    };

    Logger.warn(`[notification][email] ${JSON.stringify(basePayload)}`);
    Logger.warn(`[notification][telegram] ${JSON.stringify(basePayload)}`);
    Logger.warn(`[notification][slack] ${JSON.stringify(basePayload)}`);
    Logger.warn(`[notification][discord] ${JSON.stringify(basePayload)}`);
  }
}
