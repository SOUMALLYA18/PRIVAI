import mongoose from "mongoose";
import Joi from "joi";

// User Schema
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      minlength: [6, "Email must be at least 6 characters"],
      maxlength: [50, "Email must be at most 50 characters"],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
  },
  { timestamps: true }
);

const userModel = mongoose.model("User", userSchema);

// Joi Validation Function
export const validateUser = (data) => {
  const schema = Joi.object({
    firstName: Joi.string().min(2).max(30).required(), // Use "firstName" instead of "firstname"
    lastName: Joi.string().min(2).max(30).required(), // Use "lastName" instead of "lastname"
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });

  return schema.validate(data);
};

export const validateLogin = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });

  return schema.validate(data);
};

export default userModel;
