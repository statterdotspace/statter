import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @MaxLength(255)
  firstName!: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  lastName?: string | null;
}
