import { z } from 'zod';

export const createTaskValidation = z.object({
    body: z.object({
        title: z.string().min(2, 'Title must be at least 2 characters'),
        description: z.string().optional(),
        status: z.enum(['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'COMPLETED', 'CANCELLED']).optional(),
        priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
        dueDate: z.string().datetime().optional(),
        projectId: z.string().uuid('Invalid project ID'),
    }),
});

export const updateTaskValidation = z.object({
    body: z.object({
        title: z.string().min(2, 'Title must be at least 2 characters').optional(),
        description: z.string().optional(),
        status: z.enum(['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'COMPLETED', 'CANCELLED']).optional(),
        priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
        dueDate: z.string().datetime().optional(),
    }),
});

export const assignTaskValidation = z.object({
    body: z.object({
        userId: z.string().uuid('Invalid user ID'),
    }),
});
