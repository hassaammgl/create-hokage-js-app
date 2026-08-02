import { AppError } from "../utils/AppError.js";

export const validateRequest = (schema, isUrl = false) => (req, res, next) => {
    if (isUrl) {
        const { error } = schema.validate(req.params)
        console.log(req.params);
        console.log(error);

        if (error) {
            throw new AppError(error.details[0].message, 400)
        }
        next()
    } else {
        const { error } = schema.validate(req.body)
        if (error) {
            throw new AppError(error.details[0].message, 400)
        }
        next()
    }
}
