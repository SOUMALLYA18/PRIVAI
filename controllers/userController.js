import userModel from "../models/userModel.js";
import { createUser } from "../services/userService.js";
import { validateUser, validateLogin } from "../models/userModel.js";
import { generateToken } from "../utils/jwt.js";
import { comparePassword } from "../utils/bcryptUtils.js";
import redisClient from "../services/redisService.js";

export const registerUser = async (req, res, next) => {
  try {
    const { firstName, lastName, password, email } = req.body;

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email is already taken" });
    }

    const { error } = validateUser({ firstName, lastName, password, email });
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const user = await createUser({
      firstName,
      lastName,
      email,
      password,
    });

    const token = generateToken({ id: user._id });

    res.status(201).json({ token, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
    next(error);
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
