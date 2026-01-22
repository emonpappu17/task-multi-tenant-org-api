import { Response } from 'express';
import sendResponse from "../../shared/sendResponse";
import httpStatus from 'http-status';
import * as AuthService from './auth.service';
import { AuthenticatedRequest } from '../../middlewares/auth';

export const login = async (req: AuthenticatedRequest, res: Response) => {
    const { email, password } = req.body;
    const result = await AuthService.loginService(email, password);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Login successful',
        data: result,
    });
};