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

export const getProjectTasksService = async (
    projectId: string,
    organizationId: string,
    page = 1,
    limit = 10
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

    const skip = (page - 1) * limit;

    const [tasks, total] = await Promise.all([
        prisma.task.findMany({
            where: { projectId, organizationId },
            skip,
            take: limit,
            include: {
                assignments: {
                    select: { user: { select: { id: true, email: true, fullName: true } } },
                },
            },
            orderBy: { createdAt: 'desc' },
        }),
        prisma.task.count({ where: { projectId, organizationId } }),
    ]);

    return {
        data: tasks,
        pagination: {
            total,
            page,
            limit,
            pages: Math.ceil(total / limit),
        },
    };
};

export const assignTaskService = async (
    taskId: string,
    organizationId: string,
    userId: string,
    assignedByUserId: string
) => {
    // Check if task exists and belongs to organization
    const task = await prisma.task.findUnique({
        where: { id: taskId },
    });

    if (!task) {
        throw new AppError('Task not found', httpStatus.NOT_FOUND);
    }

    if (task.organizationId !== organizationId) {
        throw new AppError('Task does not belong to this organization', httpStatus.FORBIDDEN);
    }

    // Check if user exists and belongs to organization
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!user) {
        throw new AppError('User not found', httpStatus.NOT_FOUND);
    }

    if (user.organizationId !== organizationId) {
        throw new AppError('User does not belong to this organization', httpStatus.FORBIDDEN);
    }

    // Check if already assigned
    const existingAssignment = await prisma.taskAssignment.findUnique({
        where: { taskId_userId: { taskId, userId } },
    });

    if (existingAssignment) {
        throw new AppError('User is already assigned to this task', httpStatus.CONFLICT);
    }

    const assignment = await prisma.taskAssignment.create({
        data: {
            taskId,
            userId,
            assignedBy: assignedByUserId,
        },
        include: {
            user: {
                select: { id: true, email: true, fullName: true },
            },
            task: {
                select: { id: true, title: true },
            },
        },
    });

    return assignment;
};