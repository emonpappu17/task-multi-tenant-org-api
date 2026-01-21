import { Response } from 'express';

interface IApiResponse<T> {
    success: boolean;
    statusCode: number;
    message?: string;
    data?: T;
    error?: any;
}

const sendResponse = <T>(
    res: Response,
    data: IApiResponse<T>
): Response => {
    return res.status(data.statusCode).json({
        success: data.success,
        statusCode: data.statusCode,
        message: data.message,
        data: data.data || null,
        ...(data.error && { error: data.error }),
    });
};

export default sendResponse;
