import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  CHECKS_EXCHANGE_DEFAULT,
  CheckJobPayload,
  getChecksQueueName,
} from '@statter/utils';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMqPublisherService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RabbitMqPublisherService.name);
  private connection: amqp.ChannelModel | null = null;
  private channel: amqp.Channel | null = null;
  private exchangeName = CHECKS_EXCHANGE_DEFAULT;
  private readonly assertedRegions = new Set<string>();

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit(): Promise<void> {
    this.exchangeName =
      this.configService.get<string>('rabbitmq.checksExchange') ?? CHECKS_EXCHANGE_DEFAULT;

    const rabbitMqUrl =
      this.configService.get<string>('rabbitmq.url') ?? 'amqp://admin:admin@localhost:5672';

    this.connection = await amqp.connect(rabbitMqUrl);
    this.channel = await this.connection.createChannel();

    await this.channel.assertExchange(this.exchangeName, 'direct', { durable: true });

    this.logger.log(`RabbitMQ publisher connected (exchange="${this.exchangeName}")`);
  }

  async onModuleDestroy(): Promise<void> {
    await this.channel?.close();
    await this.connection?.close();
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
    if (!this.channel) {
      return;
    }

    if (this.assertedRegions.has(region)) {
      return;
    }

    const queueName = getChecksQueueName(region);
    await this.channel.assertQueue(queueName, { durable: true });
    await this.channel.bindQueue(queueName, this.exchangeName, region);
    this.assertedRegions.add(region);
  }
}
