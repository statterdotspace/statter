import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class AcceptInvitationResponseDto {
  @Expose()
  workspaceId!: string;

  @Expose()
  workspaceSlug!: string;

  @Expose()
  workspaceName!: string;
}

