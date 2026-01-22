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

export const getOrganizationProjects = async (req: AuthenticatedRequest, res: Response) => {
    // const { organizationId } = req.params;
    const organizationId = req?.user?.organizationId as string;
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

    const result = await ProjectService.getOrganizationProjectsService(organizationId, page, limit);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Projects retrieved successfully',
        data: result,
    });
};

export const getProjectById = async (req: AuthenticatedRequest, res: Response) => {
    const organizationId = req?.user?.organizationId as string;
    const { projectId } = req.params;

    const result = await ProjectService.getProjectByIdService(projectId, organizationId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Project retrieved successfully',
        data: result,
    });
};
