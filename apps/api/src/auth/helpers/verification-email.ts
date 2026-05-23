import { VERIFICATION_TEXT, VerificationType } from '../constants/verification.constants';

const verificationTitleByType: Record<VerificationType, string> = {
  [VerificationType.EMAIL]: 'Email verification',
  [VerificationType.LOGIN_TWO_FACTOR]: 'Two-factor login verification',
};

const buildVerificationEmail = (code: string, verificationType: VerificationType) => {
  const title = verificationTitleByType[verificationType];
  const message = `${VERIFICATION_TEXT.OTP_MESSAGE_PREFIX}: ${code}`;

  return {
    subject: VERIFICATION_TEXT.OTP_SUBJECT,
    text: `${title}\n\n${message}\n\nThe code will expire in 5 minutes.`,
    html: `<p><strong>${title}</strong></p><p>${message}</p><p>The code will expire in 5 minutes.</p>`,
  };
};

export { buildVerificationEmail };
