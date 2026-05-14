import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config/dist';
import { serverConfig } from '@statter/config';
import { AppController } from './app.controller';
import { DatabaseModule } from '@statter/database';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: serverConfig }),
    DatabaseModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
