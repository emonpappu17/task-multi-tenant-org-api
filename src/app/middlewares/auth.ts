import { NextFunction, Response } from 'express';
import httpStatus from 'http-status';
import AppError from '../utils/AppError';
import { prisma } from '../config/prisma';
import { env } from '../config/env';
import { verifyToken } from '../shared/jwt';
import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
    user?: {
        userId: string;
        role: string;
        organizationId?: string | null;
    };
}

const authCheck = (...roles: string[]) => {
    return async (
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const token = req.headers.authorization?.split(" ")[1];

            // console.log(req.headers.authorization);

            // console.log('token==>', token);

            if (!token) {
                throw new AppError('You are not authorized', httpStatus.UNAUTHORIZED);
            }

            const decoded = verifyToken(token, env.jwt_secret) as {
                userId: string;
                role: string;
                organizationId?: string | null;
            };

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

            // console.log("decoded==>", decoded);
            // console.log('roles==>', roles);

            if (roles.length && !roles.includes(decoded.role)) {
                throw new AppError(
                    'You do not have permission to access this resource',
                    httpStatus.FORBIDDEN
                );
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};

export default authCheck;
