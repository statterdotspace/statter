import databaseConfig from './server/database.config';
import redisConfig from './server/redis.config';
import oauthConfig from './server/oauth.config';
import authConfig from './server/auth.config';
import appConfig from './server/app.config';

export const serverConfig = [databaseConfig, redisConfig, oauthConfig, authConfig, appConfig];

export * from './server/types';
