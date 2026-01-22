import { prisma } from "../../config/prisma";
import AppError from "../../utils/AppError";
import httpStatus from 'http-status';
import bcrypt from "bcrypt"
import { UserRole } from "@prisma/client";
import { generateSlug } from "../../shared/generateSlug";

export const createOrganizationService = async (
    name: string,
    slug: string,
    description?: string
) => {
    // Check if slug already exists
    const existingOrg = await prisma.organization.findUnique({
        where: { slug },
    });

    if (existingOrg) {
        throw new AppError('Organization slug already exists', httpStatus.CONFLICT);
    }

    const organization = await prisma.organization.create({
        data: {
            name,
            slug,
            description,
        },
    });

    return organization;
};

export const getAllOrganizationsService = async (page = 1, limit = 10) => {
    const skip = (page - 1) * limit;

    const [organizations, total] = await Promise.all([
        prisma.organization.findMany({
            skip,
            take: limit,
            where: { isActive: true },
            include: {
                users: {
                    select: { id: true, email: true, fullName: true, role: true },
                },
                projects: {
                    select: { id: true, name: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        }),
        prisma.organization.count({ where: { isActive: true } }),
    ]);

    return {
        data: organizations,
        pagination: {
            total,
            page,
            limit,
            pages: Math.ceil(total / limit),
        },
    };
};

export const getOrganizationByIdService = async (organizationId: string) => {
    const organization = await prisma.organization.findUnique({
        where: { id: organizationId },
        include: {
            users: {
                select: { id: true, email: true, fullName: true, role: true, isActive: true },
            },
            projects: {
                select: { id: true, name: true, isActive: true },
            },
        },
    });

    if (!organization) {
        throw new AppError('Organization not found', httpStatus.NOT_FOUND);
    }

    return organization;
};


export const createFirstOrgAdminService = async (
    organizationId: string,
    email: string,
    password: string,
    fullName: string
) => {
    // Check if organization exists
    const organization = await prisma.organization.findUnique({
        where: { id: organizationId },
    });

    if (!organization) {
        throw new AppError('Organization not found', httpStatus.NOT_FOUND);
    }

    // Check if organization already has an admin
    const existingAdmin = await prisma.user.findFirst({
        where: {
            organizationId,
            role: UserRole.ORGANIZATION_ADMIN,
        },
    });

    if (existingAdmin) {
        throw new AppError('Organization already has an admin', httpStatus.CONFLICT);
    }

    // Check if email already exists
    const existingEmail = await prisma.user.findUnique({
        where: { email },
    });

    if (existingEmail) {
        throw new AppError('Email already exists', httpStatus.CONFLICT);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            fullName,
            role: UserRole.ORGANIZATION_ADMIN,
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

// export const updateOrganizationService = async (
//     organizationId: string,
//     data: { name?: string; description?: string; isActive?: boolean }
// ) => {
//     // Check if organization exists
//     const organization = await prisma.organization.findUnique({
//         where: { id: organizationId },
//     });

//     if (!organization) {
//         throw new AppError('Organization not found', httpStatus.NOT_FOUND);
//     }

//     const slug = await generateSlug(data.name as string);

//     // Check if new slug is unique (if provided)
//     if (slug && slug !== organization.slug) {
//         const existingSlug = await prisma.organization.findUnique({
//             where: { slug: slug },
//         });
//         if (existingSlug) {
//             throw new AppError('Organization slug already exists', httpStatus.CONFLICT);
//         }
//     }

//     const updatedOrg = await prisma.organization.update({
//         where: { id: organizationId },
//         data,
//     });

//     return updatedOrg;
// };


export const updateOrganizationService = async (
    organizationId: string,
    data: {
        name?: string;
        description?: string;
        isActive?: boolean;
    }
) => {
    const organization = await prisma.organization.findUnique({
        where: { id: organizationId },
    });

    if (!organization) {
        throw new AppError('Organization not found', httpStatus.NOT_FOUND);
    }

    const updateData: typeof data & { slug?: string } = { ...data };

    // Only regenerate slug if name is provided AND changed
    if (data.name && data.name !== organization.name) {
        const newSlug = await generateSlug(data.name);

        // Extra safety: avoid same slug
        if (newSlug !== organization.slug) {
            const existingSlug = await prisma.organization.findUnique({
                where: { slug: newSlug },
            });

            if (existingSlug) {
                throw new AppError(
                    'Organization slug already exists',
                    httpStatus.CONFLICT
                );
            }

            updateData.slug = newSlug;
        }
    }

    const updatedOrg = await prisma.organization.update({
        where: { id: organizationId },
        data: updateData,
    });

    return updatedOrg;
};