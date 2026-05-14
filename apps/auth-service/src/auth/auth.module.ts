import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { GoogleOAuthStrategy } from './strategies/google.strategy';
import { GithubOAuthStrategy } from './strategies/github.strategy';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';

@Module({
  imports: [
    PassportModule.register({ session: false }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('auth.jwtSecret'),
      }),
    }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    GoogleOAuthStrategy,
    GithubOAuthStrategy,
    // GitlabOAuthStrategy
  ],
})
export class AuthModule {}
