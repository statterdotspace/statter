import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  CHECKS_EXCHANGE_DEFAULT,
  CheckJobPayload,
  getChecksQueueName,
} from '@statter/utils';
import * as amqp from 'amqplib';
import { CheckExecutionService } from './check-execution.service';
import { CheckResultDeliveryService } from './check-result-delivery.service';

@Injectable()
export class WorkerRabbitMqConsumerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(WorkerRabbitMqConsumerService.name);
  private connection: amqp.ChannelModel | null = null;
  private channel: amqp.Channel | null = null;
  private workerRegion = 'eu';
  private exchangeName = CHECKS_EXCHANGE_DEFAULT;

  constructor(
    private readonly configService: ConfigService,
    private readonly checkExecutionService: CheckExecutionService,
    private readonly checkResultDeliveryService: CheckResultDeliveryService
  ) {}

  async onModuleInit(): Promise<void> {
    this.workerRegion = this.resolveWorkerRegion();
    this.exchangeName =
      this.configService.get<string>('rabbitmq.checksExchange') ?? CHECKS_EXCHANGE_DEFAULT;
    const rabbitMqUrl =
      this.configService.get<string>('rabbitmq.url') ?? 'amqp://admin:admin@localhost:5672';

    this.connection = await amqp.connect(rabbitMqUrl);
    this.channel = await this.connection.createChannel();
    await this.channel.prefetch(10);
    await this.channel.assertExchange(this.exchangeName, 'direct', { durable: true });

    const queueName = getChecksQueueName(this.workerRegion);
    await this.channel.assertQueue(queueName, { durable: true });
    await this.channel.bindQueue(queueName, this.exchangeName, this.workerRegion);

    await this.channel.consume(
      queueName,
      (message) => {
        void this.handleMessage(message);
      },
      { noAck: false }
    );

    this.logger.log(`Worker started for region="${this.workerRegion}" queue="${queueName}"`);
  }

  async onModuleDestroy(): Promise<void> {
    await this.channel?.close();
    await this.connection?.close();
  }

  private async handleMessage(message: amqp.ConsumeMessage | null): Promise<void> {
    if (!this.channel || !message) {
      return;
    }

    let job: CheckJobPayload;
    try {
      job = JSON.parse(message.content.toString()) as CheckJobPayload;
    } catch (error) {
      this.logger.warn(`Invalid check job payload: ${(error as Error).message}`);
      this.channel.ack(message);
      return;
    }

    if (!job.monitorId || typeof job.region !== 'string' || !job.region.trim()) {
      this.logger.warn(`Malformed check job was dropped: ${JSON.stringify(job)}`);
      this.channel.ack(message);
      return;
    }

    if (job.region !== this.workerRegion) {
      this.logger.warn(
        `Received job for foreign region job=${job.jobId} expected=${this.workerRegion} actual=${job.region}`
      );
      this.channel.ack(message);
      return;
    }

    try {
      Logger.log(job, `Processing check job ${job.jobId} for monitor ${job.monitorId}`);
      const checkResult = await this.checkExecutionService.execute(job);

      if (!checkResult) {
        this.channel.ack(message);
        return;
      }

      const delivery = await this.checkResultDeliveryService.deliver(checkResult);
      if (delivery.success) {
        this.channel.ack(message);
        return;
      }

      this.channel.nack(message, false, 'requeue' in delivery ? delivery.requeue : false);
    } catch (error) {
      this.logger.error(`Failed to process check job ${job.jobId}: ${(error as Error).message}`);
      this.channel.nack(message, false, true);
    }
  }

  private resolveWorkerRegion(): string {
    const rawRegion = (process.env['WORKER_REGION'] ?? 'eu').trim().toLowerCase();
    if (!rawRegion) {
      throw new Error('WORKER_REGION must be a non-empty string');
    }

    return rawRegion;
  }
}
