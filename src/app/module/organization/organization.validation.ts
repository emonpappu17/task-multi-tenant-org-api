import { z } from 'zod';

export const createOrganizationValidation = z.object({
  body: z.object({
    name: z.string().min(2, 'Organization name must be at least 2 characters'),
    // slug: z
    //   .string()
    //   .min(2, 'Slug must be at least 2 characters')
    //   .regex(/^[a-z0-9-]+$/, 'Slug must only contain lowercase letters, numbers, and hyphens'),
    description: z.string().optional(),
  }),
});

export const updateOrganizationValidation = z.object({
  body: z.object({
    name: z.string().min(2, 'Organization name must be at least 2 characters').optional(),
    description: z.string().optional(),
    isActive: z.boolean().optional(),
  }),
});


export const createFirstOrgAdminValidation = z.object({
  body: z.object({
    fullName: z.string().min(2, 'Fullname must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  }),
});