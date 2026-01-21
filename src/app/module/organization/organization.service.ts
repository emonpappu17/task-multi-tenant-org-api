import { prisma } from "../../config/prisma";
import AppError from "../../utils/AppError";
import httpStatus from 'http-status';

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
