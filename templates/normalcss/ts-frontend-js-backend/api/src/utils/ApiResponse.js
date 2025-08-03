export class ApiResponse {
    static success(res, { statusCode = 200, message = "", success = true, data = null }) {
        res.status(statusCode).json({
            success,
            message,
            data
        })
    }
    static error(res, { statusCode = 500, message = "Internal Server Error", }) {
        res.status(statusCode).json({
            success: false,
            message,
        })
    }
}