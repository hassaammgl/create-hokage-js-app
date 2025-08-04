import type { Response } from "express";

type SuccessResponseOptions<T = any> = {
	statusCode?: number;
	message?: string;
	success?: boolean;
	data?: T;
};

type ErrorResponseOptions = {
	statusCode?: number;
	message?: string;
};

export class ApiResponse {
	static success<T>(res: Response, options: SuccessResponseOptions<T>) {
		const {
			statusCode = 200,
			message = "",
			success = true,
			data = null,
		} = options;

		return res.status(statusCode).json({
			success,
			message,
			data,
		});
	}

	static error(res: Response, options: ErrorResponseOptions) {
		const { statusCode = 500, message = "Internal Server Error" } = options;

		return res.status(statusCode).json({
			success: false,
			message,
		});
	}
}
