import { EnumUserRole } from '@statter/database';

export interface IJwtPayload {
  sub: string;
  role: EnumUserRole;
}
