import { prisma } from "../../config/prisma";
import AppError from "../../utils/AppError";
import httpStatus from 'http-status';

export const createTaskService = async (
    organizationId: string,
    projectId: string,
    title: string,
    description?: string,
    status?: string,
    priority?: string,
    dueDate?: string
) => {
    // Check if project belongs to organization
    const project = await prisma.project.findUnique({
        where: { id: projectId },
    });

    if (!project) {
        throw new AppError('Project not found', httpStatus.NOT_FOUND);
    }

    if (project.organizationId !== organizationId) {
        throw new AppError('Project does not belong to this organization', httpStatus.FORBIDDEN);
    }

    const task = await prisma.task.create({
        data: {
            title,
            description,
            status: (status as any) || 'TODO',
            priority: (priority as any) || 'MEDIUM',
            dueDate: dueDate ? new Date(dueDate) : undefined,
            projectId,
            organizationId,
        },
    });

    return task;
};