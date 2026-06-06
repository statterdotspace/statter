import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: ['log', 'warn', 'error'] });
  const port = process.env['PORT'] ?? 3002;
  await app.listen(port);
  Logger.log(`Telegram bot service running on port ${port}`);
}

bootstrap();
