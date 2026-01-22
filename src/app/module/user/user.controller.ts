import { Response } from "express";
import { AuthenticatedRequest } from "../../middlewares/auth";
import sendResponse from "../../shared/sendResponse";
import httpStatus from 'http-status';
import * as UserService from './user.service';

export const createUser = async (req: AuthenticatedRequest, res: Response) => {
    const organizationId = req?.user?.organizationId as string;
    const { email, password, fullName, role } = req.body;

    const result = await UserService.createUserService(
        organizationId,
        email,
        password,
        fullName,
        role
    );

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: 'User created successfully',
        data: result,
    });
};

export const getOrganizationUsers = async (req: AuthenticatedRequest, res: Response) => {
    const organizationId = req?.user?.organizationId as string;
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

    const result = await UserService.getOrganizationUsersService(organizationId, page, limit);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Users retrieved successfully',
        data: result,
    });
};

export const getUserById = async (req: AuthenticatedRequest, res: Response) => {
    const organizationId = req?.user?.organizationId as string;
    const { userId } = req.params;

    const result = await UserService.getUserByIdService(userId, organizationId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'User retrieved successfully',
        data: result,
    });
};

export const updateUser = async (req: AuthenticatedRequest, res: Response) => {
    const organizationId = req?.user?.organizationId as string;
    const { userId } = req.params;

    const result = await UserService.updateUserService(userId, organizationId, req.body);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'User updated successfully',
        data: result,
    });
};