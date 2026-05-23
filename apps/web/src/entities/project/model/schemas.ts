import { z } from 'zod';

export const projectListSchema = z.object({
  page: z.number().int().min(1).default(1),
  perPage: z.number().int().min(1).max(100).default(10),
  search: z.string().max(255).optional(),
  sortBy: z.enum(['createdAt', 'updatedAt', 'name']).default('createdAt'),
  sortOrder: z.enum(['ASC', 'DESC']).default('DESC'),
});

export const createProjectSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().max(5000).optional(),
});

export const updateProjectSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  slug: z.string().max(255).optional(),
  description: z.string().max(5000).optional(),
});
