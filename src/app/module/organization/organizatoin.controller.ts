import { Response } from "express";
// import { AuthenticatedRequest } from "../../middlewares/authenticate";
import sendResponse from "../../shared/sendResponse";
import httpStatus from 'http-status';
import * as OrganizationService from './organization.service';
import { generateSlug } from "../../shared/generateSlug";
import { AuthenticatedRequest } from "../../middlewares/auth";

export const createOrganization = async (req: AuthenticatedRequest, res: Response) => {
    const { name, description } = req.body;
    const slug = await generateSlug(name);
    const result = await OrganizationService.createOrganizationService(
        name,
        slug,
        description
    );

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: 'Organization created successfully',
        data: result,
    });
};

export const getAllOrganizations = async (req: AuthenticatedRequest, res: Response) => {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

    const result = await OrganizationService.getAllOrganizationsService(page, limit);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Organizations retrieved successfully',
        data: result,
    });
};

export const getOrganizationById = async (req: AuthenticatedRequest, res: Response) => {
    const { organizationId } = req.params;
    const result = await OrganizationService.getOrganizationByIdService(organizationId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Organization retrieved successfully',
        data: result,
    });
};

export const createFirstOrgAdmin = async (req: AuthenticatedRequest, res: Response) => {
    const { organizationId } = req.params;
    const { email, password, fullName } = req.body;

    const result = await OrganizationService.createFirstOrgAdminService(
        organizationId,
        email,
        password,
        fullName
    );

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: 'Organization admin created successfully',
        data: result,
    });
};

export const updateOrganization = async (req: AuthenticatedRequest, res: Response) => {
  const { organizationId } = req.params;
  const result = await OrganizationService.updateOrganizationService(organizationId, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Organization updated successfully',
    data: result,
  });
};
