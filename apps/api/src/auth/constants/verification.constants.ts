export enum VerificationType {
  EMAIL = 'email',
  LOGIN_TWO_FACTOR = 'login_two_factor',
}

export enum VerificationCheck {
  VERIFIED = 'VERIFIED',
  OTP_NOT_FOUND = 'OTP_NOT_FOUND',
  OTP_INVALID = 'OTP_INVALID',
}

export const VERIFICATION_TEXT = {
  OTP_SUBJECT: 'Your verification code',
  OTP_MESSAGE_PREFIX: 'Your verification code is',
} as const;
