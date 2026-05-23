import { IsString, MaxLength, MinLength } from 'class-validator';

export class GenerateWorkspaceLogoUploadUrlDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  fileName!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  contentType!: string;
}
