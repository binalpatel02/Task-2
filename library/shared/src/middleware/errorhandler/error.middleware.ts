import type {  NextFunction,  Request,  Response} from "express";

import type { AppError } from "./error.types.js";

export const errorHandler = ( error: AppError, _req: Request, res: Response, _next: NextFunction ) => {
    console.error("ERROR:", error);

    const statusCode = error.statusCode ?? 500;

    return res.status(statusCode).json({
        success: false,
        message: error.message || "Internal Server Error"
    });
};