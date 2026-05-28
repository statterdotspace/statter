import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { serverConfig } from '@statter/config';
import { CheckExecutionService } from './check-execution.service';
import { CheckResultDeliveryService } from './check-result-delivery.service';
import { HttpsCheckerService } from './checkers/https-checker.service';
import { CheckerRegistryService } from './checkers/checker-registry.service';
import { WorkerRabbitMqConsumerService } from './worker-rabbitmq-consumer.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, load: serverConfig })],
  providers: [
    WorkerRabbitMqConsumerService,
    CheckExecutionService,
    CheckResultDeliveryService,
    HttpsCheckerService,
    CheckerRegistryService,
  ],
})
export class AppModule {}
