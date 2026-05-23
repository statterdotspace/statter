import { z } from 'zod';

export const uploadUrlSchema = z.object({
  fileName: z.string().min(1).max(255),
  contentType: z.string().min(1).max(255),
});

export const updateAvatarSchema = z.object({
  avatarUrl: z.string().url().max(1024),
});
