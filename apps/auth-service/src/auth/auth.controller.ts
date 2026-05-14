import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { GoogleAuthGuard } from './guards/google-auth';
import { GithubAuthGuard } from './guards/github-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { EnumUserProvider, UserOrm } from '@statter/database';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { clearTokensCookies, setTokensCookies } from './helpers/cookie.helpers';
import { UserExistsGuard } from './guards/user-exists.guard';
import { RegisterDto } from './dto/request/register.dto';
import { hashPassword } from './helpers/password.helpers';
import { UsersService } from '../users/users.service';
import { toDto } from '../shared/utils/dto.utils';
import { UserResponseDto } from '../users/dto/response/user-response.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Res({ passthrough: true }) response: Response, @CurrentUser() user: UserOrm) {
    const tokens = await this.authService.issueTokens({ sub: user.id, role: user.role });
    setTokensCookies(response, tokens);

    return toDto(UserResponseDto, user);
  }

  @UseGuards(UserExistsGuard)
  @Post('register')
  async register(@Res({ passthrough: true }) response: Response, @Body() dto: RegisterDto) {
    const passwordHash = await hashPassword(dto.password);

    const user = await this.usersService.create({
      ...dto,
      passwordHash,
      provider: EnumUserProvider.EMAIL,
    });

    const tokens = await this.authService.issueTokens({ sub: user.id, role: user.role });
    setTokensCookies(response, tokens);

    return toDto(UserResponseDto, user);
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    clearTokensCookies(response);
    return { success: true };
  }

  /**
   * OAuth endpoints
   */

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  googleLogin() {
    return { status: 'redirect' };
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  googleCallback(@CurrentUser() user: UserOrm) {
    return user ?? null;
  }

  @Get('github')
  @UseGuards(GithubAuthGuard)
  githubLogin() {
    return { status: 'redirect' };
  }

  @Get('github/callback')
  @UseGuards(GithubAuthGuard)
  githubCallback(@CurrentUser() user: UserOrm) {
    return toDto(UserResponseDto, user);
  }

  // @Get('gitlab')
  // @UseGuards(GitlabAuthGuard)
  // gitlabLogin() {
  //   return { status: 'redirect' };
  // }
  //
  // @Get('gitlab/callback')
  // @UseGuards(GitlabAuthGuard)
  // gitlabCallback(@CurrentUser() user: UserOrm) {
  //   return toDto(UserResponseDto, user);
  // }
}
