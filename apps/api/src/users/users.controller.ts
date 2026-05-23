import { Body, Controller, Patch, Post } from '@nestjs/common';
import { toDto } from '@statter/utils';
import { Auth } from '../auth/decorators/auth.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { StorageService } from '../core/modules/storage/storage.service';
import { UploadUrlResponseDto } from '../core/modules/storage/dto/response/upload-url-response.dto';
import { GenerateAvatarUploadUrlDto } from './dto/request/generate-avatar-upload-url.dto';
import { UpdateAvatarDto } from './dto/request/update-avatar.dto';
import { UserResponseDto } from './dto/response/user-response.dto';
import { UsersService } from './users.service';

@Controller('users')
@Auth()
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly storageService: StorageService
  ) {}

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
