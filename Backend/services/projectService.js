import mongoose from "mongoose";
import { projectModel } from "../models/projectModel.js";
import { validateUpdatedUser } from "../models/userModel.js";

export const createProject = async ({ name, users }) => {
  if (!name) {
    throw new Error("Project name is required");
  }
  if (!users || !Array.isArray(users) || users.length === 0) {
    throw new Error("At least one user ID is required");
  }
  try {
    const usersObjectIds = users.map((id) => new mongoose.Types.ObjectId(id));
    const existingProject = await projectModel.findOne({ name });
    if (existingProject) {
      throw new Error("Project name already exists");
    }
    const project = await projectModel.create({ name, users: usersObjectIds });
    return project;
  } catch (error) {
    console.error("Database Error:", error);

    if (error.code === 11000) {
      throw new Error("Project name already exists");
    }

    throw new Error("Failed to create project");
  }
};

export const getAllProjectByUserId = async ({ userId }) => {
  if (!userId) {
    throw new Error("UserId is required");
  }
  const allUserProjects = await projectModel.find({
    users: userId,
  });

  return allUserProjects;
};

export const addUsersToProject = async ({ projectId, userId, users }) => {
  try {
    const { error } = validateUpdatedUser.validate(
      { projectId, users, userId },
      { abortEarly: false }
    );
    if (error) {
      throw new Error(error.details.map((d) => d.message).join(", "));
    }
    const project = await projectModel.findOne({
      _id: projectId,
      users: userId,
    });
    if (!project) {
      throw new Error("User does not belong to this project");
    }
    const updatedProject = await projectModel.findOneAndUpdate(
      { _id: projectId },
      { $addToSet: { users: { $each: users } } },
      { new: true }
    );
    return updatedProject;
  } catch (error) {
    console.error("Error in addUserToProject Service:", error);
    throw new Error("Failed to add user to project");
  }
};

export const getProjectById = async ({ projectId }) => {
  if (!projectId) {
    throw new Error("Project ID is required");
  }
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new Error("Invalid Project ID");
  }
  const project = await projectModel
    .findOne({ _id: projectId })
    .populate("users");
  return project;
};
