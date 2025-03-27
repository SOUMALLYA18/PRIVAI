import { Router } from "express";
import { authUser } from "../middlewares/auth.js";
import {
  createProjectController,
  getAllProjects,
  addUserToProject,
  getProjectByID,
} from "../controllers/projectController.js";
const router = Router();

router.post("/create", authUser, createProjectController);
router.get("/getAllProjects", authUser, getAllProjects);
router.put("/add-user", authUser, addUserToProject);
router.get("/get-Project/:projectId", authUser, getProjectByID);
export default router;
