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