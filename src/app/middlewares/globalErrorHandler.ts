import { Prisma } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { ZodError } from 'zod';
import AppError from '../utils/AppError';


const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    let statusCode: number = httpStatus.INTERNAL_SERVER_ERROR;
    let success = false;
    let message = err?.message || 'Something went wrong!';
    let errorDetails: any = err;

    // Handle Zod Validation Errors
    if (err instanceof ZodError) {
        statusCode = httpStatus.BAD_REQUEST;
        message = 'Validation Error';
        errorDetails = err.errors.map((e) => ({
            field: e.path.join('.'),
            message: e.message,
        }));
    }
    // Handle Prisma Unique Constraint Error
    else if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
            statusCode = httpStatus.CONFLICT;
            const target = err.meta?.target;
            const fields = Array.isArray(target)
                ? target.join(', ')
                : typeof target === 'string'
                    ? target
                    : 'Field';
            message = `${fields} already exists`;

        }
        // Handle Prisma Foreign Key Constraint Error
        else if (err.code === 'P2003') {
            statusCode = httpStatus.BAD_REQUEST;
            message = 'Referenced record does not exist';
        }
        // Handle Prisma Not Found Error
        else if (err.code === 'P2025') {
            statusCode = httpStatus.NOT_FOUND;
            message = 'Record not found';
        }
        // Handle Prisma Record Not Found in Required Relation
        else if (err.code === 'P2018') {
            statusCode = httpStatus.NOT_FOUND;
            message = 'Required relation record does not exist';
        }
        errorDetails = { prismaCode: err.code };
    }
    // Handle Prisma Validation Error
    else if (err instanceof Prisma.PrismaClientValidationError) {
        statusCode = httpStatus.BAD_REQUEST;
        message = 'Invalid data provided';
        errorDetails = { error: 'Validation error from database' };
    }
    // Handle Custom AppError
    else if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
        errorDetails = null;
    }
    // Handle JWT Errors
    else if (err.name === 'JsonWebTokenError') {
        statusCode = httpStatus.UNAUTHORIZED;
        message = 'Invalid token';
    } else if (err.name === 'TokenExpiredError') {
        statusCode = httpStatus.UNAUTHORIZED;
        message = 'Token has expired';
    }

    res.status(statusCode).json({
        success,
        statusCode,
        message,
        ...(errorDetails && { error: errorDetails }),
    });
};

export default globalErrorHandler;