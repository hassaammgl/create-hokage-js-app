import { ENVS } from "../config/constants.js";
import { AppError } from "../utils/AppError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const errorHandler = (err, req, res, next) => {
    let statusCode = 500;
    let message = "Internal Server Error";
    const stack = ENVS.NODE_ENV === 'production' ? undefined : err?.stack;

    if (res.headersSent) {
        return next(err);
    }

    if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
    }
    else if (err?.name === "ValidationError") {
        statusCode = 400;
        message = err.message;
    }
    else if (err?.name === "MongoServerError") {
        statusCode = err.code === 11000 ? 409 : 400;
        message = err.message;
    }
    else if (err?.name === "JsonWebTokenError" || err?.name === "TokenExpiredError") {
        statusCode = 401;
        message = err.message;
    }
    else if (err instanceof Error) {
        message = err.message;
    }

    if (ENVS.NODE_ENV !== 'production') {
        console.error(`[${new Date().toISOString()}] Error:`, {
            path: req.path,
            method: req.method,
            message: err?.message,
            stack: err?.stack,
            body: req.body
        });
    }

    return ApiResponse.error(res, {
        statusCode,
        message,
        ...(stack && { stack })
    });
};