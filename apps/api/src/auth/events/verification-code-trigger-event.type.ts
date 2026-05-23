import { VerificationType } from '../constants/verification.constants';

export interface VerificationCodeTriggerEvent {
  identifier: string;
  type: VerificationType;
}
