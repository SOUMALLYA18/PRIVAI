import { validateProject } from "../models/projectModel.js";
import {
  createProject,
  getAllProjectByUserId,
  addUsersToProject,
  getProjectById,
} from "../services/projectService.js";
import userModel, { validateUpdatedUser } from "../models/userModel.js";

export const createProjectController = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user?.id?.toString();

    console.log("Extracted User ID in Controller:", userId);

    const { error } = validateProject({ name, users: [userId] });
    if (error) {
      return res
        .status(400)
        .json({ error: error.details.map((err) => err.message).join(", ") });
    }

    const project = await createProject({ name, users: [userId] });

    return res
      .status(201)
      .json({ message: "Project created successfully", project });
  } catch (error) {
    res.status(500).json({ error: error.message });
    next(error);
  }
};

export const getAllProjects = async (req, res) => {
  try {
    console.log("Extracted User:", req.user);

    const loggedInUser = await userModel.findOne({ email: req.user.email });

    if (!loggedInUser) {
      return res.status(404).json({ error: "User not found" });
    }

    console.log("Logged-in User from DB:", loggedInUser);

    const allProjects = await getAllProjectByUserId({
      userId: loggedInUser._id,
    });
    return res.status(200).json({ projects: allProjects });
  } catch (error) {
    console.error("Error in getAllProjects:", error);
    res.status(400).json({ error: error.message });
  }
};

export const addUserToProject = async (req, res) => {
  try {
    const { error } = validateUpdatedUser.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res
        .status(400)
        .json({ error: error.details.map((err) => err.message).join(", ") });
    }
    const { projectId, users } = req.body;

    const loggedInUser = await userModel.findOne({ email: req.user?.email });

    if (!loggedInUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const updatedProject = await addUsersToProject({
      projectId,
      users,
      userId: loggedInUser._id.toString(),
    });

    return res.status(200).json({
      message: "Users added to project successfully",
      project: updatedProject,
    });
  } catch (error) {}
};

export const getProjectByID = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await getProjectById({
      projectId,
    });
    return res.status(200).json({ project });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
