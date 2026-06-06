import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config/dist';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { serverConfig } from '@statter/config';
import { AppController } from './app.controller';
import { DatabaseModule } from '@statter/database';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { WorkspaceModule } from './workspace/workspace.module';
import { ProjectModule } from './project/project.module';
import { MonitorModule } from './monitor/monitor.module';
import { CheckModule } from './check/check.module';
import { StorageModule } from './core/modules/storage/storage.module';
import { RedisModule } from './core/modules/redis/redis.module';
import { MailerModule } from './core/modules/mailer/mailer.module';
import { InvitationsModule } from './invitations/invitations.module';
import { MembersModule } from './members/members.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: serverConfig }),
    EventEmitterModule.forRoot(),
    DatabaseModule,
    RedisModule,
    MailerModule,
    StorageModule,
    UsersModule,
    AuthModule,
    WorkspaceModule,
    InvitationsModule,
    ProjectModule,
    MonitorModule,
    CheckModule,
    MembersModule,
    NotificationsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
