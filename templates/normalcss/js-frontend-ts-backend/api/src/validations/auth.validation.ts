import Joi from "joi";

export const passwordRegex =
	/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[_@$!%*?&])[A-Za-z\d_@$!%*?&]{8,}$/;

const passwordRule = Joi.string()
	.required()
	.min(6)
	.pattern(passwordRegex)
	.message(
		"Password must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character (_@$!%*?&)"
	);

export const register = Joi.object({
	name: Joi.string().min(2).max(50).required(),
	email: Joi.string().email().required(),
	password: passwordRule,
});

export const login = Joi.object({
	email: Joi.string().email().required(),
	password: passwordRule,
});
