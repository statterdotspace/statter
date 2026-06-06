import { Body, Controller, NotFoundException, Post, UseGuards } from '@nestjs/common';
import { NotificationChannel } from '@statter/database';
import { RedisService } from '../core/modules/redis/redis.service';
import { InternalApiKeyGuard } from './guards/internal-api-key.guard';
import { NotificationsService } from './notifications.service';
import { TelegramConnectDto } from './dto/request/telegram-connect.dto';
import { SlackConnectDto } from './dto/request/slack-connect.dto';

@Controller('notifications/internal')
@UseGuards(InternalApiKeyGuard)
export class NotificationsInternalController {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly redisService: RedisService
  ) {}

  @Post('telegram/connect')
  async connectTelegram(@Body() dto: TelegramConnectDto) {
    const workspaceId = await this.redisService.get(`tg:connect:${dto.token}`);
    if (!workspaceId) {
      throw new NotFoundException('Invalid or expired token');
    }

    await this.redisService.del(`tg:connect:${dto.token}`);
    await this.notificationsService.upsert(workspaceId, NotificationChannel.TELEGRAM, {
      chatId: dto.chatId,
    });

    return { success: true };
  }

  @Post('slack/connect')
  async connectSlack(@Body() dto: SlackConnectDto) {
    await this.notificationsService.upsert(dto.workspaceId, NotificationChannel.SLACK, {
      webhookUrl: dto.webhookUrl,
      teamName: dto.teamName,
    });

    return { success: true };
  }
}
