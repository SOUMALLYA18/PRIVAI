import { Router } from "express";
import { authUser } from "../middlewares/auth.js";
import { createProjectController } from "../controllers/projectController.js";
const router = Router();

router.post("/create", authUser, createProjectController);

export default router;
