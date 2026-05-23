import { z } from 'zod';

export const monitorListSchema = z.object({
  page: z.number().int().min(1).default(1),
  perPage: z.number().int().min(1).max(100).default(10),
  projectId: z.string().uuid().optional(),
  search: z.string().max(255).optional(),
  sortBy: z.enum(['createdAt', 'updatedAt', 'name', 'lastCheckAt']).default('createdAt'),
  sortOrder: z.enum(['ASC', 'DESC']).default('DESC'),
  status: z.enum(['active', 'paused', 'disabled']).optional(),
  type: z.enum(['http', 'https', 'tcp', 'ping']).optional(),
  region: z.enum(['eu', 'us', 'asia']).optional(),
});

export const createMonitorSchema = z.object({
  projectId: z.string().uuid('Select a project'),
  name: z.string().min(1).max(255),
  description: z.string().max(5000).optional(),
  url: z.string().url('Enter a valid URL').max(2048),
  type: z.enum(['http', 'https', 'tcp', 'ping']),
  region: z.enum(['eu', 'us', 'asia']),
  intervalSeconds: z.number().int().min(10).max(86400).default(60),
  timeoutMs: z.number().int().min(100).max(120000).default(10000),
  expectedStatus: z.number().int().min(100).max(599).default(200),
  status: z.enum(['active', 'paused', 'disabled']).default('active'),
});

export const updateMonitorSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().max(5000).optional(),
  url: z.string().url().max(2048).optional(),
  type: z.enum(['http', 'https', 'tcp', 'ping']).optional(),
  region: z.enum(['eu', 'us', 'asia']).optional(),
  intervalSeconds: z.number().int().min(10).max(86400).optional(),
  timeoutMs: z.number().int().min(100).max(120000).optional(),
  expectedStatus: z.number().int().min(100).max(599).optional(),
  status: z.enum(['active', 'paused', 'disabled']).optional(),
});
