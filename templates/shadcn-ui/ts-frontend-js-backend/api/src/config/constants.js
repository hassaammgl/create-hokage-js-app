import dotenv from "dotenv"
dotenv.config()
import colors from "colors"
import { validateEnv } from "./validateEnv.js"

export const ENVS = {
    PORT: process.env.PORT || 5000,
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
    FRONTEND_URL: process.env.FRONTEND_URL,
    NODE_ENV: process.env.NODE_ENV,
} 

export const checkEnvs = async () => {
    console.time("Variables Validation time")
    try {
        const warnings = validateEnv();

        warnings.forEach(warning => {
            console.log(colors.yellow('Environment Warning:'), warning);
        });

        console.log(colors.green('Environment variables validated successfully'));

        if (ENVS.JWT_SECRET?.length < 32 || ENVS.JWT_REFRESH_SECRET?.length < 32) {
            console.log(colors.yellow('Security Warning: JWT secrets should be at least 32 characters long'));
        }

        console.log(colors.cyan('Environment Mode:'), ENVS.NODE_ENV);
    } catch (error) {
        console.error(colors.red('Environment Error:'), error.message);
        process.exit(1);
    }
    console.timeEnd("Variables Validation time")
}