import jwt from "jsonwebtoken";
import { ENVS } from "../config/constants";
import { AppError } from "./AppError";
import type { Response } from "express";

type TokenPayload = {
	id: string;
};

class Utils {
	static generateToken(id: string, isRefresh: boolean): string {
		try {
			const secret = isRefresh
				? ENVS.JWT_REFRESH_SECRET
				: ENVS.JWT_SECRET;

			if (!secret) {
				throw new Error(
					`Missing ${isRefresh ? "refresh" : "access"} token secret`
				);
			}

			return jwt.sign({ id }, secret, {
				expiresIn: isRefresh ? "7d" : "2d",
			});
		} catch (error: any) {
			console.error(`${isRefresh ? "Refresh" : "Access"} Token Error:`, {
				message: error.message,
				env: {
					hasSecret: !!(isRefresh
						? ENVS.JWT_REFRESH_SECRET
						: ENVS.JWT_SECRET),
					nodeEnv: ENVS.NODE_ENV,
				},
			});
			throw new AppError(
				`Error generating ${isRefresh ? "refresh" : "access"} token: ${
					error.message
				}`,
				500
			);
		}
	}

	static verifyToken(token: string, isRefresh: boolean): TokenPayload {
		try {
			const secret = isRefresh
				? ENVS.JWT_REFRESH_SECRET
				: ENVS.JWT_SECRET;

			if (!secret) {
				throw new Error("Missing JWT secret");
			}

			const decoded = jwt.verify(token, secret) as TokenPayload;

			return decoded;
		} catch (error: any) {
			if (error instanceof jwt.TokenExpiredError) {
				throw new AppError(
					isRefresh
						? "Access token has expired"
						: "Refresh token has expired, please login again",
					401
				);
			} else if (error instanceof jwt.JsonWebTokenError) {
				throw new AppError(
					`Invalid ${isRefresh ? "refresh" : "access"} token`,
					401
				);
			}
			throw new AppError("Token verification failed", 401);
		}
	}
}

export class TokenService {
	static generateAccessToken(id: string): string {
		return Utils.generateToken(id, false);
	}

	static generateRefreshToken(id: string): string {
		return Utils.generateToken(id, true);
	}

	static verifyAccessToken(token: string): TokenPayload {
		return Utils.verifyToken(token, false);
	}

	static verifyRefreshToken(token: string): TokenPayload {
		return Utils.verifyToken(token, true);
	}

	static setTokens(
		res: Response,
		tokens: { accessToken: string; refreshToken: string }
	): void {
		const isProd = ENVS.NODE_ENV === "production";

		res.cookie("accessToken", tokens.accessToken, {
			httpOnly: true,
			secure: isProd,
			sameSite: "strict",
			maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days
		});

		res.cookie("refreshToken", tokens.refreshToken, {
			httpOnly: true,
			secure: isProd,
			sameSite: "strict",
			maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
		});
	}

	static clearTokens(res: Response): void {
		res.cookie("accessToken", "", {
			httpOnly: true,
			expires: new Date(0),
		});

		res.cookie("refreshToken", "", {
			httpOnly: true,
			expires: new Date(0),
		});
	}
}
