import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password should be at least 8 characters'),
});

export const registerSchema = z
  .object({
    firstName: z.string().min(1, 'First name is required').max(100),
    lastName: z.string().min(1, 'Last name is required').max(100),
    email: z.string().email('Enter a valid email').max(255),
    password: z.string().min(8, 'Password should be at least 8 characters').max(100),
    confirmPassword: z.string().min(8, 'Password confirmation is required'),
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const otpSchema = z.object({
  code: z.string().length(6, 'Code should be 6 digits'),
});

export type LoginSchema = z.infer<typeof loginSchema>;
export type RegisterSchema = z.infer<typeof registerSchema>;
export type OtpSchema = z.infer<typeof otpSchema>;
