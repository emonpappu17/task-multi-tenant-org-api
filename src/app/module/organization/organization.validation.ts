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
    slug: z
      .string()
      .min(2, 'Slug must be at least 2 characters')
      .regex(/^[a-z0-9-]+$/, 'Slug must only contain lowercase letters, numbers, and hyphens')
      .optional(),
    description: z.string().optional(),
    isActive: z.boolean().optional(),
  }),
});
