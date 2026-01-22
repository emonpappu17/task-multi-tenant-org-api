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