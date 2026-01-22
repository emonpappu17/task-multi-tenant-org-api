import { prisma } from "../../config/prisma";
import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import { createAccessToken } from "../../shared/jwt";
import AppError from "../../utils/AppError";

export const loginService = async (email: string, password: string) => {
    // Check if user exists
    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        throw new AppError('Invalid email or password', httpStatus.UNAUTHORIZED);
    }

    if (!user.isActive) {
        throw new AppError('User account is inactive', httpStatus.FORBIDDEN);
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new AppError('Invalid email or password', httpStatus.UNAUTHORIZED);
    }

    // Create access token
    const accessToken = createAccessToken({
        userId: user.id,
        role: user.role,
        organizationId: user.organizationId,
    });

    return {
        accessToken,
        user: {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            role: user.role,
            organizationId: user.organizationId,
        },
    };
};

export const getCurrentUserService = async (userId: string) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            email: true,
            fullName: true,
            role: true,
            organizationId: true,
            organization: {
                select: {
                    id: true,
                    name: true,
                    slug: true,
                },
            },
            isActive: true,
            createdAt: true,
        },
    });

    if (!user) {
        throw new AppError('User not found', httpStatus.NOT_FOUND);
    }

    return user;
};