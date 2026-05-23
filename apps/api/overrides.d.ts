import type { UserOrm } from '@statter/database';

declare global {
  namespace Express {
    type User = UserOrm;

    interface Request {
      user?: User;
    }
  }
}

export {};
