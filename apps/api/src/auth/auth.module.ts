import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { GoogleOAuthStrategy } from './strategies/google.strategy';
import { GithubOAuthStrategy } from './strategies/github.strategy';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserExistsGuard } from './guards/user-exists.guard';
import { RolesGuard } from './guards/roles.guard';
import { WorkspaceModule } from '../workspace/workspace.module';
import { VerificationCodeService } from './services/verification-code.service';
import { AuthListener } from './listeners/auth.listener';

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
    WorkspaceModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalAuthGuard,
    LocalStrategy,
    JwtStrategy,
    UserExistsGuard,
    RolesGuard,
    GoogleOAuthStrategy,
    GithubOAuthStrategy,
    VerificationCodeService,
    AuthListener,
    // GitlabOAuthStrategy
  ],
  exports: [AuthService],
})
export class AuthModule {}
