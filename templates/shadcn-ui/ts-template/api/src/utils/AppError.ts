export class AppError extends Error {
	public statusCode: number;
	public isOperational: boolean;

	constructor(message: string, statusCode = 500, isOperational = true) {
		super(message);

		this.statusCode = statusCode;
		this.isOperational = isOperational;

		// Maintains proper stack trace for where our error was thrown (only available on V8)
		Error.captureStackTrace(this, this.constructor);
	}
}
