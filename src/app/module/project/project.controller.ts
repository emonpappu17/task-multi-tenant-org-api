import { Response } from "express";
import { AuthenticatedRequest } from "../../middlewares/auth";
import sendResponse from "../../shared/sendResponse";
import httpStatus from 'http-status';
import * as ProjectService from './project.service';

export const createProject = async (req: AuthenticatedRequest, res: Response) => {
    // const { organizationId } = req.params;
    const organizationId = req?.user?.organizationId as string;
    const { name, description, startDate, endDate } = req.body;

    const result = await ProjectService.createProjectService(
        organizationId,
        name,
        description,
        startDate,
        endDate
    );

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: 'Project created successfully',
        data: result,
    });
};