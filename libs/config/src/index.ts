import databaseConfig from './server/database.config';
import redisConfig from './server/redis.config';
import oauthConfig from './server/oauth.config';
import authConfig from './server/auth.config';
import appConfig from './server/app.config';
import storageConfig from './server/storage.config';
import mailConfig from './server/mail.config';
import rabbitmqConfig from './server/rabbitmq.config';
import telegramConfig from './server/telegram.config';
import slackConfig from './server/slack.config';

export const serverConfig = [
  databaseConfig,
  redisConfig,
  oauthConfig,
  authConfig,
  appConfig,
  storageConfig,
  mailConfig,
  rabbitmqConfig,
  telegramConfig,
  slackConfig,
];

export {
  databaseConfig,
  redisConfig,
  oauthConfig,
  authConfig,
  appConfig,
  storageConfig,
  mailConfig,
  rabbitmqConfig,
  telegramConfig,
  slackConfig,
};

export * from './server/types';
