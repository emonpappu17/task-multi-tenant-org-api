import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/AppError';
import httpStatus from 'http-status';
import { prisma } from '../config/prisma';
import { env } from '../config/env';
import { verifyToken } from '../shared/jwt';

export interface AuthenticatedRequest extends Request {
    user?: {
        userId: string;
        role: string;
        organizationId?: string | null;
    };
}

const authenticate = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            throw new AppError('No token provided', httpStatus.UNAUTHORIZED);
        }

        const decoded = verifyToken(token, env.jwt_secret);

        // Verify user still exists
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
        });

        if (!user || !user.isActive) {
            throw new AppError('User not found or inactive', httpStatus.UNAUTHORIZED);
        }

        req.user = {
            userId: decoded.userId,
            role: decoded.role,
            organizationId: decoded.organizationId,
        };

        next();
    } catch (error) {
        next(error);
    }
};

export default authenticate;
