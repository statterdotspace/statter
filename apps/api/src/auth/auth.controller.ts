import { Body, Controller, Get, Post, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EnumUserProvider, UserOrm } from '@statter/database';
import { extractUsernameFromEmail, toDto } from '@statter/utils';
import { Response } from 'express';
import { UsersService } from '../users/users.service';
import { WorkspaceService } from '../workspace/workspace.service';
import { AuthService } from './auth.service';
import { AuthFlowStatus } from './constants/auth-flow.constants';
import { AUTH_ROUTES } from './constants/route.constants';
import { VerificationCheck, VerificationType } from './constants/verification.constants';
import { CurrentUser } from './decorators/current-user.decorator';
import { LoginRequestDto } from './dto/request/login-request.dto';
import { RegisterDto } from './dto/request/register.dto';
import { VerifyLoginDto } from './dto/request/verify-login.dto';
import { VerifyRegistrationDto } from './dto/request/verify-registration.dto';
import { AuthChallengeResponseDto } from './dto/response/auth-challenge-response.dto';
import { AuthenticatedResponseDto } from './dto/response/authenticated-response.dto';
import { LOGIN_TWO_FACTOR_VERIFICATION_REQUIRED_EVENT } from './events/login-two-factor-verification-required.event';
import { REGISTRATION_VERIFICATION_REQUIRED_EVENT } from './events/registration-verification-required.event';
import { clearTokensCookies, setTokensCookies } from './helpers/cookie.helpers';
import { hashPassword } from './helpers/password.helpers';
import { GithubAuthGuard } from './guards/github-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { UserExistsGuard } from './guards/user-exists.guard';
import { VerificationCodeService } from './services/verification-code.service';
import { OAuthProfile } from './types/oauth.types';
import { UserNotExistsGuard } from './guards/user-not-exist.guard';
import { UserNotVerifiedGuard } from './guards/user-not-verified.guard';

@Controller('auth')
export class AuthController {
  frontendUrl!: string;

  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly workspaceService: WorkspaceService,
    private readonly verificationCodeService: VerificationCodeService,
    private readonly configService: ConfigService,
    private readonly eventEmitter: EventEmitter2
  ) {
    this.frontendUrl = this.configService.getOrThrow<string>('app.frontendUrl');
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Res({ passthrough: true }) response: Response,
    @CurrentUser() user: UserOrm,
    @Body() _dto: LoginRequestDto
  ) {
    if (user.isTwoFactorEnabled) {
      await this.eventEmitter.emitAsync(LOGIN_TWO_FACTOR_VERIFICATION_REQUIRED_EVENT, {
        identifier: user.email,
        type: VerificationType.LOGIN_TWO_FACTOR,
      });

      return toDto(AuthChallengeResponseDto, {
        status: AuthFlowStatus.OTP_REQUIRED,
        identifier: user.email,
        verificationType: VerificationType.LOGIN_TWO_FACTOR,
      });
    }

    await this.setAuthCookies(response, user);

    return toDto(AuthenticatedResponseDto, { status: AuthFlowStatus.AUTHENTICATED, user });
  }

  @UseGuards(UserNotExistsGuard, UserNotVerifiedGuard)
  @Post('login/verify')
  async verifyLogin(
    @Res({ passthrough: true }) response: Response,
    @Body() dto: VerifyLoginDto,
    @CurrentUser() user: UserOrm
  ) {
    const verification = await this.verificationCodeService.verify(
      dto.email,
      dto.code,
      VerificationType.LOGIN_TWO_FACTOR
    );

    if (verification !== VerificationCheck.VERIFIED) {
      throw new UnauthorizedException('Otp code is invalid or expired.');
    }

    await this.setAuthCookies(response, user);

    return toDto(AuthenticatedResponseDto, { status: AuthFlowStatus.AUTHENTICATED, user });
  }

  @UseGuards(UserExistsGuard)
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    await this.usersService.create({
      email: dto.email,
      username: extractUsernameFromEmail(dto.email),
      firstName: dto.firstName,
      lastName: dto.lastName,
      passwordHash: await hashPassword(dto.password),
      provider: EnumUserProvider.EMAIL,
      verifiedAt: null,
    });

    await this.eventEmitter.emitAsync(REGISTRATION_VERIFICATION_REQUIRED_EVENT, {
      identifier: dto.email,
      type: VerificationType.EMAIL,
    });

    return toDto(AuthChallengeResponseDto, {
      status: AuthFlowStatus.OTP_REQUIRED,
      identifier: dto.email,
      verificationType: VerificationType.EMAIL,
    });
  }

  @UseGuards(UserNotExistsGuard)
  @Post('register/verify')
  async verifyRegister(
    @Res({ passthrough: true }) response: Response,
    @Body() dto: VerifyRegistrationDto,
    @CurrentUser() user: UserOrm
  ) {
    const verification = await this.verificationCodeService.verify(
      dto.email,
      dto.code,
      VerificationType.EMAIL
    );

    if (verification !== VerificationCheck.VERIFIED) {
      throw new UnauthorizedException('Otp code is invalid or expired.');
    }

    const verifiedUser = await this.usersService.update(user.id, {
      verifiedAt: user.verifiedAt ?? new Date(),
    });

    await this.setAuthCookies(response, verifiedUser);

    return toDto(AuthenticatedResponseDto, {
      status: AuthFlowStatus.AUTHENTICATED,
      user: verifiedUser,
    });
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    clearTokensCookies(response);
    return { success: true };
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  googleLogin() {
    return { status: 'redirect' };
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleCallback(@Res() response: Response, @CurrentUser() profile: OAuthProfile) {
    return this.completeOAuthCallback(response, profile);
  }

  @Get('github')
  @UseGuards(GithubAuthGuard)
  githubLogin() {
    return { status: 'redirect' };
  }

  @Get('github/callback')
  @UseGuards(GithubAuthGuard)
  async githubCallback(@Res() response: Response, @CurrentUser() profile: OAuthProfile) {
    return this.completeOAuthCallback(response, profile);
  }

  private async completeOAuthCallback(response: Response, profile: OAuthProfile) {
    try {
      const user = await this.usersService.upsert({ ...profile, verifiedAt: new Date() });
      const tokens = await this.authService.issueTokens({ sub: user.id, role: user.role });
      setTokensCookies(response, tokens);
      const redirectUrl = await this.getFrontendWorkspaceUrl(user.id);

      return response.redirect(redirectUrl);
    } catch {
      clearTokensCookies(response);
      return response.redirect(
        new URL(`${AUTH_ROUTES.SIGN_IN}?error=oauth`, this.frontendUrl).toString()
      );
    }
  }

  private async getFrontendWorkspaceUrl(userId: string): Promise<string> {
    const first = await this.workspaceService.findFirstByUserId(userId);
    if (!first?.slug) {
      return new URL(AUTH_ROUTES.CREATE_WORKSPACE, this.frontendUrl).toString();
    }
    return new URL(`/${first.slug}`, this.frontendUrl).toString();
  }

  private async setAuthCookies(response: Response, user: UserOrm) {
    const tokens = await this.authService.issueTokens({ sub: user.id, role: user.role });
    setTokensCookies(response, tokens);
  }
}
