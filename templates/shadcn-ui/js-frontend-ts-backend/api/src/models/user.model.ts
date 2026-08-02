import mongoose, { Document, Model, Types } from "mongoose";
import argon2 from "argon2";
import { passwordRegex } from "../validations/auth.validation.js"; // 👈 use `.js` if you're using ESM

export interface IUser extends Document {
	name: string;
	email: string;
	password?: string; // <- because it's `select: false`
	refreshToken?: string;
	_id: Types.ObjectId;
	verifyPassword(candidatePassword: string): Promise<boolean>;
}

interface IUserModel extends Model<IUser> {}

const userSchema = new mongoose.Schema<IUser, IUserModel>(
	{
		name: {
			type: String,
			required: [true, "Name is required"],
			trim: true,
		},
		email: {
			type: String,
			required: [true, "Email is required"],
			unique: true,
			lowercase: true,
			validate: {
				validator: (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
				message: (props) =>
					`${props.value} is not a valid email address!`,
			},
		},
		password: {
			type: String,
			required: [true, "Password is required"],
			select: false,
			validate: {
				validator: function (v: string) {
					return passwordRegex.test(v);
				},
				message:
					"Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)",
			},
		},
		refreshToken: {
			type: String,
			select: false,
		},
	},
	{
		timestamps: true,
	}
);

userSchema.pre<IUser>("save", async function (next) {
	if (!this.isModified("password")) return next();

	try {
		if (this.password) {
			this.password = await argon2.hash(this.password);
		}
		next();
	} catch (err) {
		next(err as Error);
	}
});

userSchema.methods.verifyPassword = async function (
	candidatePassword: string
): Promise<boolean> {
	if (!this.password) return false;

	try {
		return await argon2.verify(this.password, candidatePassword);
	} catch (err) {
		console.error("argon2.verify failed:", err);
		return false;
	}
};

const User = mongoose.model<IUser, IUserModel>("User", userSchema);
export default User;
