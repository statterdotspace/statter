import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { serverConfig } from '@statter/config';
import { RabbitMqModule } from '@statter/rabbitmq';
import { ExecutionService } from './execution.service';
import { ResultPublisherService } from './result-publisher.service';
import { HttpsCheckerService } from './checkers/https-checker.service';
import { CheckerRegistryService } from './checkers/checker-registry.service';
import { WorkerConsumerService } from './worker-consumer.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, load: serverConfig }), RabbitMqModule],
  providers: [
    WorkerConsumerService,
    ExecutionService,
    ResultPublisherService,
    HttpsCheckerService,
    CheckerRegistryService,
  ],
})
export class AppModule {}
