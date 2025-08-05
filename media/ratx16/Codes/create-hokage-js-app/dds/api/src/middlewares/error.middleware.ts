import type { Request, Response, NextFunction } from "express";
import { ENVS } from "../config/constants";
import { AppError } from "../utils/AppError";
import { ApiResponse } from "../utils/ApiResponse";

export interface ExtendedError extends Error {
	statusCode?: number;
	code?: number | string;
	stack?: string;
	name: string;
	cause?: unknown;
	errors?: Record<string, any>; 
}


export const errorHandler = (
	err: ExtendedError,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	let statusCode = 500;
	let message = "Internal Server Error";

	const stack = ENVS.NODE_ENV === "production" ? undefined : err?.stack;

	if (res.headersSent) {
		return next(err);
	}

	// Custom AppError
	if (err instanceof AppError) {
		statusCode = err.statusCode;
		message = err.message;
	}
	// Mongoose validation error
	else if (err.name === "ValidationError") {
		statusCode = 400;
		message = err.message;
	}
	// MongoDB duplicate key error
	else if (err.name === "MongoServerError") {
		statusCode = err.code === 11000 ? 409 : 400;
		message = err.message;
	}
	// JWT errors
	else if (
		err.name === "JsonWebTokenError" ||
		err.name === "TokenExpiredError"
	) {
		statusCode = 401;
		message = err.message;
	}
	// Other JS errors
	else if (err instanceof Error) {
		message = err.message;
	}

	// Dev logging
	if (ENVS.NODE_ENV !== "production") {
		console.error(`[${new Date().toISOString()}] Error:`, {
			path: req.path,
			method: req.method,
			message: err.message,
			stack: err.stack,
			body: req.body,
		});
	}

	// Final response
	return ApiResponse.error(res, {
		statusCode,
		message,
		...(stack && { stack }), 
	});
};
