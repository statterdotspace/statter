import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMqConnectionService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RabbitMqConnectionService.name);
  private connection: amqp.ChannelModel | null = null;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit(): Promise<void> {
    const url = this.configService.get<string>('rabbitmq.url') ?? 'amqp://admin:admin@localhost:5672';
    this.connection = await amqp.connect(url);
    this.logger.log('RabbitMQ connection established');
  }

  async onModuleDestroy(): Promise<void> {
    await this.connection?.close();
  }

  async createChannel(): Promise<amqp.Channel> {
    if (!this.connection) {
      throw new Error('RabbitMQ connection is not initialized');
    }
    return this.connection.createChannel();
  }
}
