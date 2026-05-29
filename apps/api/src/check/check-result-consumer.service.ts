import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MonitorRegion } from '@statter/database';
import {
  CheckResultPayload,
  getCheckResultsDlqName,
  getCheckResultsDlxName,
  getCheckResultsQueueName,
} from '@statter/utils';
import { BaseRabbitMqConsumer, RabbitMqConnectionService } from '@statter/rabbitmq';
import * as amqp from 'amqplib';
import { MonitorService } from '../monitor/monitor.service';
import { CheckService } from './check.service';
import { CreateCheckResultDto } from './dto/request/create-check-result.dto';

@Injectable()
export class CheckResultConsumerService extends BaseRabbitMqConsumer {
  private readonly logger = new Logger(CheckResultConsumerService.name);
  private exchangeName!: string;

  constructor(
    rabbitMqConnection: RabbitMqConnectionService,
    private readonly configService: ConfigService,
    private readonly monitorService: MonitorService,
    private readonly checkService: CheckService
  ) {
    super(rabbitMqConnection);
  }

  protected async setup(): Promise<void> {
    this.exchangeName = this.configService.getOrThrow('rabbitmq.checkResultsExchange');

    const dlxName = getCheckResultsDlxName();
    await this.channel.prefetch(10);
    await this.channel.assertExchange(this.exchangeName, 'direct', { durable: true });
    await this.channel.assertExchange(dlxName, 'direct', { durable: true });

    for (const region of Object.values(MonitorRegion)) {
      const dlqName = getCheckResultsDlqName(region);
      await this.channel.assertQueue(dlqName, { durable: true });
      await this.channel.bindQueue(dlqName, dlxName, region);

      const queueName = getCheckResultsQueueName(region);
      await this.channel.assertQueue(queueName, {
        durable: true,
        arguments: { 'x-dead-letter-exchange': dlxName },
      });
      await this.channel.bindQueue(queueName, this.exchangeName, region);

      await this.channel.consume(
        queueName,
        (message) => {
          void this.handleMessage(message);
        },
        { noAck: false }
      );
    }

    this.logger.log(
      `CheckResult consumer listening on exchange="${this.exchangeName}" regions=[${Object.values(MonitorRegion).join(', ')}] dlx="${dlxName}"`
    );
  }

  protected async handleMessage(message: amqp.ConsumeMessage | null): Promise<void> {
    if (!this.channel || !message) {
      return;
    }

    let payload: CheckResultPayload;
    try {
      payload = JSON.parse(message.content.toString()) as CheckResultPayload;
    } catch {
      this.channel.ack(message);
      return;
    }

    if (!payload.monitorId) {
      this.channel.ack(message);
      return;
    }

    try {
      const monitor = await this.monitorService.findById(payload.monitorId);
      if (!monitor) {
        this.channel.ack(message);
        return;
      }

      await this.checkService.ingestCheckResult(
        payload as unknown as CreateCheckResultDto,
        monitor
      );
      this.channel.ack(message);
    } catch (error) {
      this.logger.error(
        `Failed to ingest check result for monitor=${payload.monitorId}: ${(error as Error).message}`
      );
      this.channel.nack(message, false, false);
    }
  }
}
