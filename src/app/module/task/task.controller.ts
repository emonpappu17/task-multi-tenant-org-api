import { Response } from "express";
import { AuthenticatedRequest } from "../../middlewares/auth";
import sendResponse from "../../shared/sendResponse";
import httpStatus from 'http-status';
import * as TaskService from './task.service';

export const createTask = async (req: AuthenticatedRequest, res: Response) => {
    // const { projectId } = req.params;
    const organizationId = req?.user?.organizationId as string;
    const { title, description, status, priority, dueDate, projectId } = req.body;

    const result = await TaskService.createTaskService(
        organizationId,
        projectId,
        title,
        description,
        status,
        priority,
        dueDate
    );

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: 'Task created successfully',
        data: result,
    });
};


export const getProjectTasks = async (req: AuthenticatedRequest, res: Response) => {
    const organizationId = req?.user?.organizationId as string;
    const { projectId } = req.params;

    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

    const result = await TaskService.getProjectTasksService(projectId, organizationId, page, limit);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Tasks retrieved successfully',
        data: result,
    });
};

export const assignTask = async (req: AuthenticatedRequest, res: Response) => {
    // const { organizationId, taskId } = req.params;
    const organizationId = req?.user?.organizationId as string;
    const { userId, taskId } = req.body;

    const result = await TaskService.assignTaskService(
        taskId,
        organizationId,
        userId,
        req.user!.userId
    );

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: 'Task assigned successfully',
        data: result,
    });
};

