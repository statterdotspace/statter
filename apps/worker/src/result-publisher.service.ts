import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  CheckResultPayload,
  getCheckResultsDlxName,
  getCheckResultsQueueName,
} from '@statter/utils';
import { BaseRabbitMqPublisher, RabbitMqConnectionService } from '@statter/rabbitmq';

@Injectable()
export class ResultPublisherService extends BaseRabbitMqPublisher {
  private readonly logger = new Logger(ResultPublisherService.name);
  private exchangeName!: string;
  private workerRegion = 'eu';

  constructor(
    rabbitMqConnection: RabbitMqConnectionService,
    private readonly configService: ConfigService
  ) {
    super(rabbitMqConnection);
  }

  protected async setup(): Promise<void> {
    this.exchangeName = this.configService.getOrThrow('rabbitmq.checkResultsExchange');
    this.workerRegion = this.configService.getOrThrow('WORKER_REGION');

    const dlxName = getCheckResultsDlxName();
    await this.channel.assertExchange(this.exchangeName, 'direct', { durable: true });
    await this.channel.assertExchange(dlxName, 'direct', { durable: true });

    const queueName = getCheckResultsQueueName(this.workerRegion);
    await this.channel.assertQueue(queueName, {
      durable: true,
      arguments: { 'x-dead-letter-exchange': dlxName },
    });
    await this.channel.bindQueue(queueName, this.exchangeName, this.workerRegion);

    this.logger.log(
      `CheckResult publisher ready (exchange="${this.exchangeName}" region="${this.workerRegion}")`
    );
  }

  async publish(result: CheckResultPayload): Promise<void> {
    const body = Buffer.from(JSON.stringify(result));
    this.channel.publish(this.exchangeName, result.region, body, {
      persistent: true,
      contentType: 'application/json',
    });
  }
}
