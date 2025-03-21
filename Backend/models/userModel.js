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
    firstName: Joi.string().min(2).max(30).required(),
    lastName: Joi.string().min(2).max(30).required(),
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

const objectIdValidation = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.message("Invalid ObjectId format");
  }
  return value;
};
export const validateUpdatedUser = Joi.object({
  projectId: Joi.string().custom(objectIdValidation).required().messages({
    "any.required": "projectId is required",
  }),
  users: Joi.array()
    .items(Joi.string().custom(objectIdValidation))
    .min(1)
    .required()
    .messages({
      "any.required": "users array is required",
      "array.min": "At least one user ID is required",
    }),
  userId: Joi.string().custom(objectIdValidation).optional(),
});

export default userModel;
