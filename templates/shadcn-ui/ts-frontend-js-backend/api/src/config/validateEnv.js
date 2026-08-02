
export const validateEnv = () => {
    const requiredEnvs = [
        { key: "PORT", default: "5000" },
        { key: "MONGO_URI", required: true },
        { key: "JWT_SECRET", required: true },
        { key: "JWT_REFRESH_SECRET", required: true },
        { key: "FRONTEND_URL", required: true },
        { key: "NODE_ENV", default: "development" },
    ];
    const missingEnvs = []
    const warnings = []

    requiredEnvs.forEach(env => {
        if (!process.env[env.key]) {
            if (env.required) {
                missingEnvs.push(env.key)
            }
            else if (env.default) {
                process.env[env.key] = env.default;
                warnings.push(`${env.key} not set, using default value: ${env.default}`)
            }
        }
    })

    if (missingEnvs.length > 0) {
        throw new Error(
            `Missing required environment variables: ${missingEnvs.join(', ')}\n` +
            `Please check your .env file and ensure all required variables are set.`
        )
    }
    return warnings;
}