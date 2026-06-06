import { IsString } from 'class-validator';

export class SlackConnectDto {
  @IsString()
  workspaceId!: string;

  @IsString()
  webhookUrl!: string;

  @IsString()
  teamName!: string;
}
