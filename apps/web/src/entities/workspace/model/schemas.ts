import { z } from 'zod';

export const createWorkspaceSchema = z.object({
  name: z.string().min(1).max(255),
  slug: z.string().max(255).optional(),
  logoUrl: z.string().url().max(1024).optional(),
});

export const updateWorkspaceSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  slug: z.string().max(255).optional(),
  logoUrl: z.string().url().max(1024).optional(),
});
