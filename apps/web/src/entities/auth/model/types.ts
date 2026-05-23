export interface User {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  email: string;
  username: string;
  firstName: string;
  lastName: string | null;
  avatarUrl: string | null;
  verifiedAt: string | null;
  isTwoFactorEnabled: boolean;
  role: 'ADMIN' | 'USER';
  provider: 'EMAIL' | 'GOOGLE' | 'GITHUB' | 'GITLAB';
}

export interface LoginPayload {
  email: string;
  password: string;
}

export type VerificationType = 'email' | 'login_two_factor';
export type AuthFlowStatus = 'otp_required' | 'authenticated';

export interface VerifyOtpPayload {
  email: string;
  code: string;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface AuthChallengeResponse {
  status: 'otp_required';
  verificationType: VerificationType;
  identifier: string;
}

export interface AuthenticatedResponse {
  status: 'authenticated';
  user: User;
}

export type AuthFlowResponse = AuthChallengeResponse | AuthenticatedResponse;
