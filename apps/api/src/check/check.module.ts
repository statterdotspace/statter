import { Module } from '@nestjs/common';
import { CheckService } from './check.service';
import { CheckController } from './check.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CheckOrm, MonitorOrm } from '@statter/database';
import { WorkspaceModule } from '../workspace/workspace.module';
import { MonitorModule } from '../monitor/monitor.module';
import { RabbitMqModule } from '@statter/rabbitmq';
import { CheckGateway } from './check.gateway';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { WsJwtAuthGuard } from './guards/ws-jwt-auth.guard';
import { WsExceptionFilter } from '../core/filters/ws-exception.filter';
import { CheckResultListener } from './listeners/check-result.listener';
import { CheckResultConsumerService } from './check-result-consumer.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CheckOrm, MonitorOrm]),
    WorkspaceModule,
    MonitorModule,
    UsersModule,
    RabbitMqModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('auth.jwtSecret'),
      }),
    }),
  ],
  controllers: [CheckController],
  providers: [
    CheckService,
    CheckResultConsumerService,
    WsJwtAuthGuard,
    WsExceptionFilter,
    CheckGateway,
    CheckResultListener,
  ],
  exports: [CheckService],
})
export class CheckModule {}
