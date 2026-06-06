'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getErrorMessage, userApi } from '@/shared/api';
import type { ConfirmPasswordChangePayload, UpdateProfilePayload } from '@/entities';

const useProfileSettings = () => {
  const queryClient = useQueryClient();

  const userQuery = useQuery({
    queryKey: ['user-me'],
    queryFn: () => userApi.getMe(),
  });

  const updateProfileMutation = useMutation({
    mutationFn: (payload: UpdateProfilePayload) => userApi.updateProfile(payload),
    onSuccess: async () => {
      toast.success('Profile updated');
      await queryClient.invalidateQueries({ queryKey: ['user-me'] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const requestPasswordChangeMutation = useMutation({
    mutationFn: () => userApi.requestPasswordChange(),
    onSuccess: () => toast.success('Verification code sent to your email'),
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const confirmPasswordChangeMutation = useMutation({
    mutationFn: (payload: ConfirmPasswordChangePayload) => userApi.confirmPasswordChange(payload),
    onSuccess: () => toast.success('Password changed successfully'),
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const toggleTwoFactorMutation = useMutation({
    mutationFn: (enabled: boolean) => userApi.toggleTwoFactor({ enabled }),
    onSuccess: async (user) => {
      toast.success(user.isTwoFactorEnabled ? '2FA enabled' : '2FA disabled');
      await queryClient.invalidateQueries({ queryKey: ['user-me'] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const deleteAccountMutation = useMutation({
    mutationFn: () => userApi.deleteAccount(),
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  return {
    userQuery,
    updateProfileMutation,
    requestPasswordChangeMutation,
    confirmPasswordChangeMutation,
    toggleTwoFactorMutation,
    deleteAccountMutation,
  };
};

export { useProfileSettings };
