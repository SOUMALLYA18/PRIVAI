import mongoose from "mongoose";
import { projectModel } from "../models/projectModel.js";

export const createProject = async ({ name, users }) => {
  if (!name) {
    throw new Error("Project name is required");
  }
  if (!users || users.length === 0) {
    throw new Error("User ID is required");
  }

  try {
    // Convert user IDs to ObjectId
    const usersObjectIds = users.map((id) => new mongoose.Types.ObjectId(id));

    const project = await projectModel.create({ name, users: usersObjectIds });
    return project;
  } catch (error) {
    // Handle MongoDB Duplicate Key Error
    if (error.code === 11000) {
      throw new Error("Project name already exists");
    }

    console.error("Database Error:", error);
    throw new Error("Failed to create project");
  }
};
