import dotenv from "dotenv";
dotenv.config();
import colors from "colors";
import { validateEnv } from "./validateEnv.js";

interface IEnvConfig {
	PORT: string | number;
	MONGO_URI: string;
	JWT_SECRET: string;
	JWT_REFRESH_SECRET: string;
	FRONTEND_URL: string;
	NODE_ENV: string;
}

export const ENVS: IEnvConfig = {
	PORT: process.env.PORT || 5000,
	MONGO_URI: process.env.MONGO_URI as string,
	JWT_SECRET: process.env.JWT_SECRET as string,
	JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
	FRONTEND_URL: process.env.FRONTEND_URL as string,
	NODE_ENV: process.env.NODE_ENV || "development",
};

export const checkEnvs = async (): Promise<void> => {
	console.time("Variables Validation time");
	try {
		const warnings = validateEnv();

		warnings.forEach((warning) => {
			console.log(colors.yellow("Environment Warning:"), warning);
		});

		console.log(
			colors.green("Environment variables validated successfully")
		);

		if (
			ENVS.JWT_SECRET.length < 32 ||
			ENVS.JWT_REFRESH_SECRET.length < 32
		) {
			console.log(
				colors.yellow(
					"Security Warning: JWT secrets should be at least 32 characters long"
				)
			);
		}

		console.log(colors.cyan("Environment Mode:"), ENVS.NODE_ENV);
	} catch (error: unknown) {
		if (error instanceof Error) {
			console.error(colors.red("Environment Error:"), error.message);
		} else {
			console.error(
				colors.red(
					"An unknown error occurred during environment validation"
				)
			);
		}
		process.exit(1);
	}
	console.timeEnd("Variables Validation time");
};
