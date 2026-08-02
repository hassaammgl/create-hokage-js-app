export class AppError extends Error {
    statusCode;
    isOperational;
    constructor(message, statusCode = 500, isOperational = true) {
        super(message);
        this.statusCode = statusCode
        this.isOperational = isOperational
        Error.captureStackTrace(this, this.constructor)
    }

}