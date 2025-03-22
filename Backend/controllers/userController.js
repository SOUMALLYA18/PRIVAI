import userModel from "../models/userModel.js";
import { validateUser, validateLogin } from "../models/userModel.js";
import { generateToken } from "../utils/jwt.js";
import { createUser, fetchAllUsers } from "../services/userservice.js";
import { comparePassword } from "../utils/bcryptUtils.js";
import redisClient from "../services/redisService.js";

export const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, password, email } = req.body;

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const { error } = validateUser({ firstName, lastName, password, email });
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const user = await createUser({
      firstName,
      lastName,
      email,
      password,
    });
    const token = generateToken({ id: user._id });
    delete user._doc.password;

    res.status(201).json({ token, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const loginuser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { error } = validateLogin({ email, password });
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const user = await userModel.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid Credentials" });
    }

    const token = generateToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    delete user._doc.password;
    res.status(200).json({ token, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
    next(error);
  }
};

export const getUserProfile = async (req, res, next) => {
  res.status(201).json({ user: req.user });
};

export const logoutuser = async (req, res, next) => {
  try {
    const token =
      req.cookies?.token || req.headers.authorization?.split(" ")[1];

    redisClient.set(token, "logged out", "EX", 7 * 24 * 60 * 60);

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const loggedInUser = await userModel.findOne({ email: req.user?.email });

    if (!loggedInUser) {
      console.error("❌ Logged-in user not found in DB");
      return res.status(404).json({ error: "Logged-in user not found" });
    }

    console.log("✅ Logged In User ID:", loggedInUser._id);

    const allUsers = await fetchAllUsers({ userId: loggedInUser._id });

    if (!allUsers.length) {
      console.error("❌ No users found in DB");
      return res.status(404).json({ error: "No users found" });
    }

    console.log("✅ Users fetched successfully:", allUsers);

    return res.status(200).json({ allUsers });
  } catch (error) {
    console.error("❌ Error fetching users:", error.message);
    res.status(500).json({ error: error.message });
    next(error);
  }
};
