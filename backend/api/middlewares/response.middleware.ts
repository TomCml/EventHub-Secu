import type { NextFunction, Request, Response } from "express";

export interface ApiResponse {
    success: boolean;
    data: any;
    error?: {
        message: string,
        code: number
    }
}

declare module "express-serve-static-core" {
    interface Response {
        jsonSuccess(data: any, statusCode?: number): void,
        jsonError(error: any, statusCode?: number): void
    }
}

export function ApiResponseMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    res.jsonSuccess = (data: any, statusCode: number = 200) => {
        const response: ApiResponse = {
            success: true,
            data
        };
        res.status(statusCode).json(response)
    }

    res.jsonError = (error: any, statusCode: number = 400) => {
        const response: ApiResponse = {
            success: false,
            data: null,
            error: {
                message: error,
                code: statusCode
            }
        };
        res.status(statusCode).json(response)
    };
    next();
}