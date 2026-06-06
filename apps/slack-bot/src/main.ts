import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  const port = process.env['PORT'] ?? 4001;
  await app.listen(port);
  Logger.log(`Slack OAuth service running on port ${port}`);
}

bootstrap();
