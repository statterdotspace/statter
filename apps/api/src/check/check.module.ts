import { Module } from '@nestjs/common';
import { CheckService } from './check.service';
import { CheckController } from './check.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CheckOrm, MonitorOrm } from '@statter/database';
import { WorkspaceModule } from '../workspace/workspace.module';
import { MonitorModule } from '../monitor/monitor.module';
import { CheckInternalController } from './check-internal.controller';
import { InternalApiKeyGuard } from './guards/internal-api-key.guard';
import { CheckGateway } from './check.gateway';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { WsJwtAuthGuard } from './guards/ws-jwt-auth.guard';
import { WsExceptionFilter } from '../core/filters/ws-exception.filter';
import { CheckResultListener } from './listeners/check-result.listener';
import { CheckResultMonitorExistsGuard } from './guards/check-result-monitor-exists.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([CheckOrm, MonitorOrm]),
    WorkspaceModule,
    MonitorModule,
    UsersModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('auth.jwtSecret'),
      }),
    }),
  ],
  controllers: [CheckController, CheckInternalController],
  providers: [
    CheckService,
    InternalApiKeyGuard,
    CheckResultMonitorExistsGuard,
    WsJwtAuthGuard,
    WsExceptionFilter,
    CheckGateway,
    CheckResultListener,
  ],
  exports: [CheckService],
})
export class CheckModule {}
