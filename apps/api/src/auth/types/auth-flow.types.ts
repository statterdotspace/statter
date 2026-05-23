import { UserOrm } from '@statter/database';
import { VerificationType } from '../constants/verification.constants';

export interface OtpChallengeResult {
  identifier: string;
  verificationType: VerificationType;
}

export interface AuthenticatedResult {
  user: UserOrm;
}

export type LoginResult = AuthenticatedResult | OtpChallengeResult;
