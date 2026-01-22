import { prisma } from "../../config/prisma";
import AppError from "../../utils/AppError";
import httpStatus from 'http-status';

export const createProjectService = async (
    organizationId: string,
    name: string,
    description?: string,
    startDate?: string,
    endDate?: string
) => {
    // Check if organization exists
    const organization = await prisma.organization.findUnique({
        where: { id: organizationId },
    });

    if (!organization) {
        throw new AppError('Organization not found', httpStatus.NOT_FOUND);
    }

    const project = await prisma.project.create({
        data: {
            name,
            description,
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined,
            organizationId,
        },
    });

    return project;
};

export const getOrganizationProjectsService = async (
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

    const [projects, total] = await Promise.all([
        prisma.project.findMany({
            where: { organizationId, isActive: true },
            skip,
            take: limit,
            include: {
                tasks: {
                    select: { id: true, title: true, status: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        }),
        prisma.project.count({ where: { organizationId, isActive: true } }),
    ]);

    return {
        data: projects,
        pagination: {
            total,
            page,
            limit,
            pages: Math.ceil(total / limit),
        },
    };
};

