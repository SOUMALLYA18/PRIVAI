import { validateProject } from "../models/projectModel.js";
import { createProject } from "../services/projectService.js";
import userModel from "../models/userModel.js";
export const createProjectController = async (req, res, next) => {
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
