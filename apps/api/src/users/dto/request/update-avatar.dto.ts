import { IsString, IsUrl, MaxLength } from 'class-validator';

export class UpdateAvatarDto {
  @IsString()
  @IsUrl({ require_tld: false })
  @MaxLength(1024)
  avatarUrl!: string;
}
