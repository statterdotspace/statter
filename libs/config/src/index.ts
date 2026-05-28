import databaseConfig from './server/database.config';
import redisConfig from './server/redis.config';
import oauthConfig from './server/oauth.config';
import authConfig from './server/auth.config';
import appConfig from './server/app.config';
import storageConfig from './server/storage.config';
import mailConfig from './server/mail.config';
import rabbitmqConfig from './server/rabbitmq.config';
import internalConfig from './server/internal.config';

export const serverConfig = [
  databaseConfig,
  redisConfig,
  oauthConfig,
  authConfig,
  appConfig,
  storageConfig,
  mailConfig,
  rabbitmqConfig,
  internalConfig,
];

export * from './server/types';
