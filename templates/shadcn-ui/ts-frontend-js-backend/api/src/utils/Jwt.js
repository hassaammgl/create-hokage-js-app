import jwt from 'jsonwebtoken';
import { ENVS } from '../config/constants.js';
import { AppError } from './AppError.js';

class Utils {
    static genrateToken(id, isRefresh) {
        try {
            if (isRefresh ? !ENVS.JWT_REFRESH_SECRET : !ENVS.JWT_SECRET) {
                throw new Error(isRefresh ? 'Error getting access token secret' : "Error getting access token secret");
            }

            return jwt.sign({ id }, isRefresh ? ENVS.JWT_REFRESH_SECRET : ENVS.JWT_SECRET, {
                expiresIn: isRefresh ? "7d" : "2d"
            });
        } catch (error) {
            console.error(`${isRefresh ? "Refresh" : "Access"} Token Error:`, {
                message: error.message,
                env: {
                    hasSecret: isRefresh ? !!ENVS.JWT_REFRESH_SECRET : !!ENVS.JWT_SECRET,
                    nodeEnv: ENVS.NODE_ENV
                }
            });
            throw new AppError(`Error generating ${isRefresh ? "refresh" : "access"} token: ${error.message}`, 500);
        }
    }
    static verifyToken(token, isRefresh) {
        try {
            return jwt.verify(token, isRefresh ? ENVS.JWT_REFRESH_SECRET : ENVS.JWT_SECRET);
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                throw new AppError(isRefresh ? 'Access token has expired' : "Refresh token has expired, please login again", 401);
            } else if (error instanceof jwt.JsonWebTokenError) {
                throw new AppError(`Invalid ${isRefresh ? "refresh" : "access"} token`, 401);
            }
            throw new AppError('Token verification failed', 401);
        }
    }
}

export class TokenService {
    static generateAccessToken(id) {
        return Utils.genrateToken(id, false)
    }
    static generateRefreshToken(id) {
        return Utils.genrateToken(id, true)
    }

    static verifyAccessToken(token) {
        return Utils.verifyToken(token, false)
    }
    static verifyRefreshToken(token) {
        return Utils.verifyToken(token, true)
    }
    static setTokens(res, { accessToken, refreshToken }) {
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: ENVS.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 2 * 24 * 60 * 60 * 1000
        })
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: ENVS.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
    }
    static clearTokens(res) {
        res.cookie("accessToken", "", {
            httpOnly: true,
            expires: new Date(0)
        })
        res.cookie("refreshToken", "", {
            httpOnly: true,
            expires: new Date(0)
        })
    }
}