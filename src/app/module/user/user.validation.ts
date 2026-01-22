import { z } from 'zod';

export const createUserByAdminValidation = z.object({
    body: z.object({
        email: z.string().email('Invalid email address'),
        password: z.string().min(6, 'Password must be at least 6 characters'),
        fullName: z.string().min(2, 'Full name is required'),
        role: z.enum(['ORGANIZATION_ADMIN', 'ORGANIZATION_MEMBER']),
    }),
});

export const updateUserValidation = z.object({
    body: z.object({
        fullName: z.string().min(2, 'Full name is required').optional(),
        isActive: z.boolean().optional(),
    }),
});
