import { z } from 'zod';

export const uploadUrlSchema = z.object({
  fileName: z.string().min(1).max(255),
  contentType: z.string().min(1).max(255),
});

export const updateAvatarSchema = z.object({
  avatarUrl: z.string().url().max(1024),
});

export const updateProfileSchema = z.object({
  firstName: z.string().min(1).max(255),
  lastName: z.string().max(255).nullable().optional(),
});

export const confirmPasswordChangeSchema = z.object({
  code: z.string().length(6),
  newPassword: z.string().min(8),
  confirmPassword: z.string().min(8),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});
