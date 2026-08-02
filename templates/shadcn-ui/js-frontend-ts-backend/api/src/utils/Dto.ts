import type { IUser } from "../models/user.model";

export class DTO {
	static userDto(user: IUser) {
		return {
			_id: user._id.toString(),
			name: user.name,
			email: user.email,
			// You can optionally add:
			// role: user.role,
			// avatar: user.avatar,
			// etc...
		};
	}
}
