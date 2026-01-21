import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "./authenticate";
import httpStatus from 'http-status';
import AppError from "../utils/AppError";

export const authorizeRoles = (...allowedRoles: string[]) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            throw new AppError('User not authenticated', httpStatus.UNAUTHORIZED);
        }

        if (!allowedRoles.includes(req.user.role)) {
            throw new AppError(
                'You do not have permission to access this resource',
                httpStatus.FORBIDDEN
            );
        }

        next();
    };
};