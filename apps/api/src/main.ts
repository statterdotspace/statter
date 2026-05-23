import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const frontendUrl = configService.get<string>('app.frontendUrl') ?? 'http://localhost:3000';
  const port = Number(process.env['API_PORT'] ?? 4000);

  app.use(cookieParser());
  app.enableCors({
    origin: frontendUrl,
    credentials: true,
  });

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    })
  );

  await app.listen(port);
  Logger.log(`API server is running on http://localhost:${port}`);
}

bootstrap();
