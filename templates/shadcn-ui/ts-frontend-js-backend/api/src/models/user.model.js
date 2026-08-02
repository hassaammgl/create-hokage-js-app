import mongoose from "mongoose";
import argon2 from "argon2";
import { passwordRegex } from "../validations/auth.validation.js";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"]
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    validate: {
      validator: (v) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: props => `${props.value} is not a valid email address!`
    }
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    select: false,
    validate: {
      validator: function (v) {
        return passwordRegex.test(v);
      },
      message: () => 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)'
    }
  },
  refreshToken: {
    type: String,
    select: false
  },

});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    this.password = await argon2.hash(this.password);
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.methods.verifyPassword = async function (candidatePassword) {
  return await argon2.verify(this.password, candidatePassword);
};

const User = mongoose.model("User", userSchema);
export default User;
