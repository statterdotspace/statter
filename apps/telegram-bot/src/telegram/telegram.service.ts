import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Bot } from 'grammy';

@Injectable()
export class TelegramService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(TelegramService.name);
  private bot!: Bot;

  private readonly botToken: string;
  private readonly apiUrl: string;
  private readonly internalApiKey: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService
  ) {
    this.botToken = this.configService.getOrThrow<string>('TELEGRAM_BOT_TOKEN');
    this.apiUrl = this.configService.getOrThrow<string>('API_URL');
    this.internalApiKey = this.configService.getOrThrow<string>('INTERNAL_API_KEY');
  }

  onModuleInit() {
    this.bot = new Bot(this.botToken);

    this.bot.command('start', async (ctx) => {
      const token = ctx.match?.trim();
      const chatId = String(ctx.chat.id);

      if (!token) {
        await ctx.reply(
          '👋 Hello! To connect this chat to your Statter workspace, click "Connect Telegram" in your workspace settings.'
        );
        return;
      }

      try {
        await firstValueFrom(
          this.httpService.post(
            `${this.apiUrl}/notifications/internal/telegram/connect`,
            { token, chatId },
            { headers: { 'x-internal-api-key': this.internalApiKey } }
          )
        );

        await ctx.reply(
          '✅ Successfully connected! You will now receive monitor alerts in this chat.'
        );
      } catch (error: unknown) {
        this.logger.error('Failed to connect workspace', error);
        const isNotFound =
          (error as { response?: { status?: number } })?.response?.status === 404;

        await ctx.reply(
          isNotFound
            ? '❌ The connection link has expired. Please generate a new one from your workspace settings.'
            : '❌ Something went wrong. Please try again later.'
        );
      }
    });

    this.bot.catch((err) => {
      this.logger.error('Grammy error', err);
    });

    void this.bot.start();
    this.logger.log('Telegram bot started (long polling)');
  }

  async onModuleDestroy() {
    await this.bot?.stop();
  }
}
