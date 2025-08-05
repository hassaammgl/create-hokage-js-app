import type { Request, Response, NextFunction } from "express";
import { TokenService } from "../utils/Jwt";
import { AppError } from "../utils/AppError";
import { ApiResponse } from "../utils/ApiResponse";
import User from "../models/user.model";

declare global {
	namespace Express {
		interface Request {
			user?: any; 
		}
	}
}

export const protect = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const accessToken = req.cookies?.accessToken;

		if (!accessToken) {
			throw new AppError("Access token is required", 401);
		}

		const decoded = TokenService.verifyAccessToken(accessToken);

		const user = await User.findById(decoded.id).select(
			"-password -refreshToken"
		);

		if (!user) {
			throw new AppError("User not found", 404);
		}

		req.user = user;
		next();
	} catch (error: any) {
		if (error.message?.includes("expired")) {
			return ApiResponse.error(res, {
				message: "Access token expired",
				statusCode: 401,
			});
		}
		next(error);
	}
};
