import { prisma } from "../../config/prisma";
import httpStatus from 'http-status';
import bcrypt from 'bcrypt';
import AppError from "../../utils/AppError";

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