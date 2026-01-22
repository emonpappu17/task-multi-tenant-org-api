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