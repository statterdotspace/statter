import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ProjectResponseDto {
  @Expose()
  id!: string;

  @Expose()
  workspaceId!: string;

  @Expose()
  createdById?: string;

  @Expose()
  name!: string;

  @Expose()
  slug!: string;

  @Expose()
  description?: string;

  @Expose()
  createdAt!: Date;

  @Expose()
  updatedAt!: Date;
}
