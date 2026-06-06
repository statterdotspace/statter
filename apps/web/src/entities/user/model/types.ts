export interface UpdateAvatarPayload {
  avatarUrl: string;
}

export interface UpdateProfilePayload {
  firstName: string;
  lastName?: string | null;
}

export interface RequestPasswordChangeResponse {
  success: boolean;
}

export interface ConfirmPasswordChangePayload {
  code: string;
  newPassword: string;
}

export interface ToggleTwoFactorPayload {
  enabled: boolean;
}
