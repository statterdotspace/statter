import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CheckJobPayload, getChecksDlxName, getChecksQueueName } from '@statter/utils';
import { BaseRabbitMqPublisher, RabbitMqConnectionService } from '@statter/rabbitmq';

@Injectable()
export class RabbitMqPublisherService extends BaseRabbitMqPublisher {
  private readonly logger = new Logger(RabbitMqPublisherService.name);
  private exchangeName!: string;
  private readonly assertedRegions = new Set<string>();

  constructor(
    rabbitMqConnection: RabbitMqConnectionService,
    private readonly configService: ConfigService
  ) {
    super(rabbitMqConnection);
  }

  protected async setup(): Promise<void> {
    this.exchangeName = this.configService.getOrThrow('rabbitmq.checksExchange');
    await this.channel.assertExchange(this.exchangeName, 'direct', { durable: true });
    this.logger.log(`RabbitMQ publisher connected (exchange="${this.exchangeName}")`);
  }

  async publishCheckJob(job: CheckJobPayload): Promise<void> {
    if (!this.channel) {
      throw new Error('RabbitMQ channel is not initialized');
    }

    const routingKey = job.region.trim().toLowerCase();
    if (!routingKey) {
      throw new Error('Check job region is required');
    }

    await this.assertRegionalQueue(routingKey);
    const body = Buffer.from(JSON.stringify(job));

    this.channel.publish(this.exchangeName, routingKey, body, {
      persistent: true,
      contentType: 'application/json',
      messageId: job.jobId,
      timestamp: Date.now(),
    });
  }

  private async assertRegionalQueue(region: string): Promise<void> {
    if (!this.channel || this.assertedRegions.has(region)) {
      return;
    }

    const queueName = getChecksQueueName(region);
    const dlxName = getChecksDlxName();
    await this.channel.assertQueue(queueName, {
      durable: true,
      arguments: { 'x-dead-letter-exchange': dlxName },
    });
    await this.channel.bindQueue(queueName, this.exchangeName, region);
    this.assertedRegions.add(region);
  }
}
