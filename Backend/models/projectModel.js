import mongoose from "mongoose";
import Joi from "joi";

// Mongoose Schema
const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

// Joi Validation Schema
export const validateProject = (data) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    users: Joi.array().items(Joi.string().hex().length(24)).min(1).required(),
  });

  return schema.validate(data);
};

export const projectModel = mongoose.model("Project", projectSchema);
