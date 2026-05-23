import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateWorkspaceDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  slug?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1024)
  logoUrl?: string;
}
