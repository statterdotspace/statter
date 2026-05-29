import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import * as amqp from 'amqplib';
import { RabbitMqConnectionService } from './rabbitmq-connection.service';

export abstract class BaseRabbitMqPublisher implements OnModuleInit, OnModuleDestroy {
  protected channel!: amqp.Channel;

  constructor(protected readonly rabbitMqConnection: RabbitMqConnectionService) {}

  async onModuleInit(): Promise<void> {
    this.channel = await this.rabbitMqConnection.createChannel();
    await this.setup();
  }

  async onModuleDestroy(): Promise<void> {
    await this.channel?.close();
  }

  protected abstract setup(): Promise<void>;
}
