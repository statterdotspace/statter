import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  CheckJobPayload,
  getChecksDlqName,
  getChecksDlxName,
  getChecksQueueName,
} from '@statter/utils';
import { BaseRabbitMqConsumer, RabbitMqConnectionService } from '@statter/rabbitmq';
import * as amqp from 'amqplib';
import { ExecutionService } from './execution.service';
import { ResultPublisherService } from './result-publisher.service';

@Injectable()
export class WorkerConsumerService extends BaseRabbitMqConsumer {
  private readonly logger = new Logger(WorkerConsumerService.name);
  private workerRegion = 'eu';
  private exchangeName!: string;

  constructor(
    rabbitMqConnection: RabbitMqConnectionService,
    private readonly configService: ConfigService,
    private readonly checkExecutionService: ExecutionService,
    private readonly checkResultPublisherService: ResultPublisherService
  ) {
    super(rabbitMqConnection);
  }

  protected async setup(): Promise<void> {
    this.exchangeName = this.configService.getOrThrow('rabbitmq.checksExchange');
    this.workerRegion = this.configService.getOrThrow('WORKER_REGION');

    await this.channel.prefetch(10);
    await this.channel.assertExchange(this.exchangeName, 'direct', { durable: true });

    const dlxName = getChecksDlxName();
    await this.channel.assertExchange(dlxName, 'direct', { durable: true });

    const dlqName = getChecksDlqName(this.workerRegion);
    await this.channel.assertQueue(dlqName, { durable: true });
    await this.channel.bindQueue(dlqName, dlxName, this.workerRegion);

    const queueName = getChecksQueueName(this.workerRegion);
    await this.channel.assertQueue(queueName, {
      durable: true,
      arguments: { 'x-dead-letter-exchange': dlxName },
    });
    await this.channel.bindQueue(queueName, this.exchangeName, this.workerRegion);

    await this.channel.consume(queueName, (message) => this.handleMessage(message), {
      noAck: false,
    });

    this.logger.log(
      `Worker started for region="${this.workerRegion}" queue="${queueName}" dlq="${dlqName}"`
    );
  }

  protected async handleMessage(message: amqp.ConsumeMessage | null): Promise<void> {
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

      await this.checkResultPublisherService.publish(checkResult);
      this.channel.ack(message);
    } catch (error) {
      this.logger.error(`Failed to process check job ${job.jobId}: ${(error as Error).message}`);
      this.channel.nack(message, false, false);
    }
  }
}
