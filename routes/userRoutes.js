import { Router } from "express";
import {
  registerUser,
  loginuser,
  getUserProfile,
  logoutuser,
} from "../controllers/userController.js";
import { authUser } from "../middlewares/auth.js";
const router = Router();

router.post("/register", registerUser);
router.post("/login", loginuser);
router.get("/profile", authUser, getUserProfile);
router.get("/logout", authUser, logoutuser);
export default router;
