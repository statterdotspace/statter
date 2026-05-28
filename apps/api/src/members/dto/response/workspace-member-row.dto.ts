import { Exclude, Expose } from 'class-transformer';
import { WorkspaceMemberRole } from '@statter/database';

export type WorkspaceMemberStatus = 'active' | 'invited';

@Exclude()
export class WorkspaceMemberRowDto {
  @Expose()
  id!: string;

  @Expose()
  email!: string;

  @Expose()
  role!: WorkspaceMemberRole;

  @Expose()
  status!: WorkspaceMemberStatus;
}

