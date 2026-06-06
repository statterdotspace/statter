import { IsString } from 'class-validator';

export class TelegramConnectDto {
  @IsString()
  token!: string;

  @IsString()
  chatId!: string;
}
