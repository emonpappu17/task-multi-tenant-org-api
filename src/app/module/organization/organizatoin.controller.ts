import { Response } from "express";
import { AuthenticatedRequest } from "../../middlewares/authenticate";
import sendResponse from "../../shared/sendResponse";
import httpStatus from 'http-status';
import * as OrganizationService from './organization.service';
import { generateSlug } from "../../shared/generateSlug";

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