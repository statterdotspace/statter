import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MonitorOrm, MonitorStatus } from '@statter/database';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CheckJobPayload } from '@statter/utils';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { RabbitMqPublisherService } from './rabbitmq-publisher.service';

@Injectable()
export class MonitorDispatchService implements OnModuleInit {
  private readonly logger = new Logger(MonitorDispatchService.name);
  private isDispatching = false;

  constructor(
    @InjectRepository(MonitorOrm)
    private readonly monitorRepo: Repository<MonitorOrm>,
    private readonly rabbitMqPublisherService: RabbitMqPublisherService
  ) {}

  async onModuleInit(): Promise<void> {
    this.logger.log('Scheduler started (cron-based) with interval=1m');
    void this.dispatchDueMonitors();
  }

  @Cron(CronExpression.EVERY_MINUTE, {
    name: 'monitor-dispatch',
  })
  async handleCronTick(): Promise<void> {
    Logger.log('Scheduler started');
    await this.dispatchDueMonitors();
  }

  private async dispatchDueMonitors(): Promise<void> {
    if (this.isDispatching) {
      return;
    }

    this.isDispatching = true;
    const now = new Date();
    const batchSize = this.readPositiveInt('SCHEDULER_BATCH_SIZE', 200);

    try {
      const candidates = await this.monitorRepo.find({
        where: {
          status: MonitorStatus.ACTIVE,
        },
        order: {
          lastQueuedAt: 'ASC',
        },
        take: batchSize * 5,
      });

      const dueMonitors = candidates
        .filter((monitor) => this.isMonitorDue(monitor, now))
        .slice(0, batchSize);

      if (dueMonitors.length > 0) {
        await Promise.all(
          dueMonitors.map(async (monitor) => {
            const job: CheckJobPayload = {
              jobId: randomUUID(),
              monitorId: monitor.id,
              workspaceId: monitor.workspaceId,
              projectId: monitor.projectId,
              url: monitor.url,
              type: monitor.type,
              region: monitor.region,
              timeoutMs: monitor.timeoutMs,
              expectedStatus: monitor.expectedStatus,
              queuedAt: now.toISOString(),
            };

            await this.rabbitMqPublisherService.publishCheckJob(job);
          })
        );

        await this.monitorRepo.update(
          dueMonitors.map((monitor) => monitor.id),
          { lastQueuedAt: now }
        );
      }
      this.logger.debug(`Dispatch tick completed: published=${dueMonitors.length}`);
    } catch (error) {
      this.logger.error('Scheduler tick failed', error);
    } finally {
      this.isDispatching = false;
    }
  }

  private isMonitorDue(monitor: MonitorOrm, now: Date): boolean {
    const anchorTimestamp =
      monitor.lastQueuedAt?.getTime() ??
      monitor.lastCheckAt?.getTime() ??
      monitor.createdAt.getTime();
    const elapsedMs = now.getTime() - anchorTimestamp;
    return elapsedMs >= monitor.intervalSeconds * 1000;
  }

  private readPositiveInt(envName: string, fallback: number): number {
    const value = Number(process.env[envName] ?? fallback);
    if (!Number.isFinite(value) || value <= 0) {
      return fallback;
    }

    return Math.floor(value);
  }
}
