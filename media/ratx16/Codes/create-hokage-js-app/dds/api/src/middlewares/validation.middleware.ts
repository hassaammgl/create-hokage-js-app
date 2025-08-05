import type { Request, Response, NextFunction } from "express";
import type { Schema } from "joi";
import { AppError } from "../utils/AppError";

export const validateRequest = (schema: Schema, isUrl = false) => {
	return (req: Request, res: Response, next: NextFunction): void => {
		const dataToValidate = isUrl ? req.params : req.body;
		const { error } = schema.validate(dataToValidate, {
			abortEarly: false,
		}); // optional: validate all fields

		if (error?.details?.length) {
			const message = error.details
				.map((detail) => detail.message)
				.join(", ");
			throw new AppError(message, 400);
		}

		next();
	};
};
