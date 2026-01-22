import { z } from 'zod';

export const createProjectValidation = z.object({
    body: z.object({
        name: z.string().min(2, 'Project name must be at least 2 characters'),
        description: z.string().optional(),
        startDate: z.string().datetime().optional(),
        endDate: z.string().datetime().optional(),
    }),
});

export const updateProjectValidation = z.object({
    body: z.object({
        name: z.string().min(2, 'Project name must be at least 2 characters').optional(),
        description: z.string().optional(),
        startDate: z.string().datetime().optional(),
        endDate: z.string().datetime().optional(),
        isActive: z.boolean().optional(),
    }),
});
