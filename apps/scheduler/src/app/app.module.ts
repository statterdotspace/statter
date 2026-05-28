import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { serverConfig } from '@statter/config';
import { DatabaseModule, MonitorOrm } from '@statter/database';
import { ScheduleModule } from '@nestjs/schedule';
import { RabbitMqPublisherService } from './rabbitmq-publisher.service';
import { MonitorDispatchService } from './monitor-dispatch.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: serverConfig }),
    ScheduleModule.forRoot(),
    DatabaseModule,
    TypeOrmModule.forFeature([MonitorOrm]),
  ],
  providers: [RabbitMqPublisherService, MonitorDispatchService],
})
export class AppModule {}
