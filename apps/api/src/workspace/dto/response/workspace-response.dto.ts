import { Exclude, Expose } from 'class-transformer';
import { WorkspacePlan } from '@statter/database';

@Exclude()
export class WorkspaceResponseDto {
  @Expose()
  id!: string;

  @Expose()
  name!: string;

  @Expose()
  slug!: string;

  @Expose()
  logoUrl!: string | null;

  @Expose()
  plan!: WorkspacePlan;

  @Expose()
  maxMembers!: number;

  @Expose()
  maxProjects!: number;

  @Expose()
  maxMonitors!: number;

  @Expose()
  inviteCode!: string;

  @Expose()
  membersCount!: number;

  @Expose()
  createdAt!: Date;

  @Expose()
  updatedAt!: Date;
}
