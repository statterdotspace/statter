import { Exclude, Expose } from 'class-transformer';
import { EnumUserProvider, EnumUserRole } from '@statter/database';

@Exclude()
export class UserResponseDto {
  @Expose()
  id!: string;

  @Expose()
  createdAt!: Date;

  @Expose()
  updatedAt!: Date;

  @Expose()
  deletedAt!: Date | null;

  @Expose()
  email!: string;

  @Expose()
  username!: string;

  @Expose()
  firstName!: string;

  @Expose()
  lastName!: string | null;

  @Expose()
  avatarUrl!: string | null;

  @Expose()
  verifiedAt!: Date | null;

  @Expose()
  isTwoFactorEnabled!: boolean;

  @Expose()
  role!: EnumUserRole;

  @Expose()
  provider!: EnumUserProvider;
}
