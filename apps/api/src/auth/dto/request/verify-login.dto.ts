import { IsEmail, IsString, Length, MaxLength } from 'class-validator';

export class VerifyLoginDto {
  @IsEmail()
  @MaxLength(255)
  email!: string;

  @IsString()
  @Length(6, 6)
  code!: string;
}
