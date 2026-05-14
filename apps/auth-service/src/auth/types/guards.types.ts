import { Request } from 'express';
import { UserOrm } from '@statter/database';

export interface RequestWithOAuthUser extends Request {
  existingUser?: UserOrm | null;
}
