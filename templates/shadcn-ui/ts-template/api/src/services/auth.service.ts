import User from "../models/user.model.js";
import type { IUser } from "../models/user.model.js";
import { TokenService } from "../utils/Jwt.js";
import { AppError } from "../utils/AppError.js";
import { DTO } from "../utils/Dto.js";

export class AuthService {
	private static async generateAuthTokens(user: IUser) {
		const userId = user._id.toString();

		const accessToken = TokenService.generateAccessToken(userId);
		const refreshToken = TokenService.generateRefreshToken(userId);

		user.refreshToken = refreshToken;
		await user.save({ validateBeforeSave: false });

		return { accessToken, refreshToken };
	}

	static async register(data: {
		email: string;
		name: string;
		password: string;
	}) {
		const { email, name, password } = data;

		const existingUser = await User.findOne({ email });
		if (existingUser) {
			throw new AppError("Email already in use", 400);
		}

		const user = new User({ email, password, name });
		await user.save();

		const tokens = await this.generateAuthTokens(user);

		return {
			...tokens,
			user: DTO.userDto(user),
		};
	}

	static async login(data: { email: string; password: string }) {
		const { email, password } = data;

		const user = await User.findOne({ email }).select(
			"+password +refreshToken"
		);

		if (!user) {
			throw new AppError("Invalid email or password", 401);
		}

		if (!user.password || typeof user.password !== "string") {
			throw new AppError("User password is invalid or missing", 500);
		}

		let isPasswordValid = false;

		try {
			isPasswordValid = await user.verifyPassword(password);
		} catch (err) {
			if (
				err instanceof Error &&
				err.message.includes("pchstr must be a non-empty string")
			) {
				throw new AppError(
					"Internal authentication error. Contact support.",
					500
				);
			}
			throw err;
		}

		if (!isPasswordValid) {
			throw new AppError("Invalid email or password", 401);
		}

		const tokens = await this.generateAuthTokens(user);

		return {
			...tokens,
			user: DTO.userDto(user),
		};
	}

	static async logout(userId: string) {
		await User.findByIdAndUpdate(userId, { refreshToken: null });
		return true;
	}
}
