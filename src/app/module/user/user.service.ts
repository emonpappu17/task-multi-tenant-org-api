import { prisma } from "../../config/prisma";
import httpStatus from 'http-status';
import bcrypt from 'bcrypt';
import AppError from "../../utils/AppError";
import { UserRole } from "@prisma/client";

export const createUserService = async (
    organizationId: string,
    email: string,
    password: string,
    fullName: string,
    role: 'ORGANIZATION_ADMIN' | 'ORGANIZATION_MEMBER'
) => {
    // Check if organization exists
    const organization = await prisma.organization.findUnique({
        where: { id: organizationId },
    });

    if (!organization) {
        throw new AppError('Organization not found', httpStatus.NOT_FOUND);
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        throw new AppError('Email already exists', httpStatus.CONFLICT);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            fullName,
            role,
            organizationId,
        },
    });

    return {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        organizationId: user.organizationId,
    };
};

export const getOrganizationUsersService = async (
    organizationId: string,
    page = 1,
    limit = 10
) => {
    // Check if organization exists
    const organization = await prisma.organization.findUnique({
        where: { id: organizationId },
    });

    if (!organization) {
        throw new AppError('Organization not found', httpStatus.NOT_FOUND);
    }

    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
        prisma.user.findMany({
            where: { organizationId },
            skip,
            take: limit,
            select: {
                id: true,
                email: true,
                fullName: true,
                role: true,
                isActive: true,
                createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
        }),
        prisma.user.count({ where: { organizationId } }),
    ]);

    return {
        data: users,
        pagination: {
            total,
            page,
            limit,
            pages: Math.ceil(total / limit),
        },
    };
};

export const getUserByIdService = async (userId: string, organizationId: string) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            email: true,
            fullName: true,
            role: true,
            organizationId: true,
            isActive: true,
            createdAt: true,
        },
    });

    if (!user) {
        throw new AppError('User not found', httpStatus.NOT_FOUND);
    }

    // Ensure user belongs to the organization
    if (user.organizationId !== organizationId) {
        throw new AppError('User does not belong to this organization', httpStatus.FORBIDDEN);
    }

    return user;
};

export const updateUserService = async (
    userId: string,
    organizationId: string,
    data: { fullName?: string; isActive?: boolean }
) => {
    // Get the user
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!user) {
        throw new AppError('User not found', httpStatus.NOT_FOUND);
    }

    // Ensure user belongs to the organization
    if (user.organizationId !== organizationId) {
        throw new AppError('User does not belong to this organization', httpStatus.FORBIDDEN);
    }

    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data,
        select: {
            id: true,
            email: true,
            fullName: true,
            role: true,
            organizationId: true,
            isActive: true,
            createdAt: true,
        },
    });

    return updatedUser;
};

export const deleteUserService = async (userId: string, organizationId: string) => {
    // Get the user
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!user) {
        throw new AppError('User not found', httpStatus.NOT_FOUND);
    }

    // Ensure user belongs to the organization
    if (user.organizationId !== organizationId) {
        throw new AppError('User does not belong to this organization', httpStatus.FORBIDDEN);
    }

    // Prevent deleting the last admin
    if (user.role === UserRole.ORGANIZATION_ADMIN) {
        const adminCount = await prisma.user.count({
            where: {
                organizationId,
                role: UserRole.ORGANIZATION_ADMIN,
            },
        });

        if (adminCount === 1) {
            throw new AppError(
                'Cannot delete the last organization admin',
                httpStatus.BAD_REQUEST
            );
        }
    }

    await prisma.user.delete({
        where: { id: userId },
    });

    return { message: 'User deleted successfully' };
};