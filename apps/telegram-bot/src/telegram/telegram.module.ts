import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TelegramService } from './telegram.service';

@Module({
  imports: [HttpModule],
  providers: [TelegramService],
})
export class TelegramModule {}
