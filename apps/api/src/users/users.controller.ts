import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Response } from 'express';
import { toDto } from '@statter/utils';
import { UserOrm } from '@statter/database';
import { Auth } from '../auth/decorators/auth.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { StorageService } from '../core/modules/storage/storage.service';
import { UploadUrlResponseDto } from '../core/modules/storage/dto/response/upload-url-response.dto';
import { VerificationCodeService } from '../auth/services/verification-code.service';
import { VerificationCheck, VerificationType } from '../auth/constants/verification.constants';
import { hashPassword } from '../auth/helpers/password.helpers';
import { clearTokensCookies } from '../auth/helpers/cookie.helpers';
import { GenerateAvatarUploadUrlDto } from './dto/request/generate-avatar-upload-url.dto';
import { UpdateAvatarDto } from './dto/request/update-avatar.dto';
import { UpdateProfileDto } from './dto/request/update-profile.dto';
import { ConfirmPasswordChangeDto } from './dto/request/confirm-password-change.dto';
import { ToggleTwoFactorDto } from './dto/request/toggle-two-factor.dto';
import { UserResponseDto } from './dto/response/user-response.dto';
import { UsersService } from './users.service';
import { PASSWORD_CHANGE_REQUEST_EVENT } from './events/password-change-request.event';

@Controller('users')
@Auth()
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly storageService: StorageService,
    private readonly verificationCodeService: VerificationCodeService,
    private readonly eventEmitter: EventEmitter2
  ) {}

  @Get('me')
  async getMe(@CurrentUser() user: UserOrm) {
    return toDto(UserResponseDto, user);
  }

  @Patch('me/profile')
  async updateProfile(@CurrentUser('id') userId: string, @Body() dto: UpdateProfileDto) {
    const user = await this.usersService.update(userId, {
      firstName: dto.firstName,
      lastName: dto.lastName ?? null,
    });
    return toDto(UserResponseDto, user);
  }

  @Post('me/password/request')
  async requestPasswordChange(@CurrentUser() user: UserOrm) {
    await this.eventEmitter.emitAsync(PASSWORD_CHANGE_REQUEST_EVENT, {
      identifier: user.email,
      type: VerificationType.CHANGE_PASSWORD,
    });

    return { success: true };
  }

  @Patch('me/password')
  async confirmPasswordChange(
    @CurrentUser() user: UserOrm,
    @Body() dto: ConfirmPasswordChangeDto
  ) {
    const verification = await this.verificationCodeService.verify(
      user.email,
      dto.code,
      VerificationType.CHANGE_PASSWORD
    );

    if (verification !== VerificationCheck.VERIFIED) {
      throw new UnauthorizedException('OTP code is invalid or expired.');
    }

    const updatedUser = await this.usersService.update(user.id, {
      passwordHash: await hashPassword(dto.newPassword),
    });

    return toDto(UserResponseDto, updatedUser);
  }

  @Patch('me/two-factor')
  async toggleTwoFactor(@CurrentUser('id') userId: string, @Body() dto: ToggleTwoFactorDto) {
    const user = await this.usersService.update(userId, { isTwoFactorEnabled: dto.enabled });
    return toDto(UserResponseDto, user);
  }

  @Delete('me')
  async deleteAccount(
    @CurrentUser('id') userId: string,
    @Res({ passthrough: true }) response: Response
  ) {
    await this.usersService.softDelete(userId);
    clearTokensCookies(response);
    return { success: true };
  }

  @Post('me/avatar/upload-url')
  async generateAvatarUploadUrl(
    @CurrentUser('id') userId: string,
    @Body() dto: GenerateAvatarUploadUrlDto
  ) {
    const payload = await this.storageService.generatePresignedUploadUrl({
      ownerPath: `users/${userId}/avatar`,
      fileName: dto.fileName,
      contentType: dto.contentType,
    });

    return toDto(UploadUrlResponseDto, payload);
  }

  @Patch('me/avatar')
  async updateAvatar(@CurrentUser('id') userId: string, @Body() dto: UpdateAvatarDto) {
    const user = await this.usersService.update(userId, { avatarUrl: dto.avatarUrl });
    return toDto(UserResponseDto, user);
  }
}
